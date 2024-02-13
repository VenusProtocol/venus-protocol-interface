import { fireEvent, waitFor, within } from '@testing-library/react';
import BigNumber from 'bignumber.js';
import { en } from 'libs/translations';
import noop from 'noop-ts';
import Vi from 'vitest';

import fakeAccountAddress from '__mocks__/models/address';
import fakeContractTransaction from '__mocks__/models/contractTransaction';
import { xvs } from '__mocks__/models/tokens';
import { vBnb, vXvs } from '__mocks__/models/vTokens';
import { renderComponent } from 'testUtils/render';

import { supply } from 'clients/api';
import useCollateral from 'hooks/useCollateral';
import useTokenApproval from 'hooks/useTokenApproval';
import { Asset, Pool } from 'types';

import SupplyForm from '..';
import { fakeAsset, fakePool } from '../__testUtils__/fakeData';
import TEST_IDS from '../testIds';

vi.mock('hooks/useCollateral');
vi.mock('hooks/useTokenApproval');

describe('SupplyForm', () => {
  it('displays correct token wallet balance', async () => {
    const { getByText } = renderComponent(
      <SupplyForm onCloseModal={noop} pool={fakePool} asset={fakeAsset} />,
      {
        accountAddress: fakeAccountAddress,
      },
    );

    await waitFor(() => getByText('10.00M XVS'));
  });

  it('displays correct token supply balance', async () => {
    const { getByText } = renderComponent(
      <SupplyForm onCloseModal={noop} pool={fakePool} asset={fakeAsset} />,
      {
        accountAddress: fakeAccountAddress,
      },
    );

    await waitFor(() => getByText('1.00K'));
  });

  it('displays warning notice if asset is from an isolated pool', async () => {
    const customFakePool: Pool = {
      ...fakePool,
      isIsolated: true,
    };

    const { getByTestId } = renderComponent(
      <SupplyForm onCloseModal={noop} pool={customFakePool} asset={fakeAsset} />,
      {
        accountAddress: fakeAccountAddress,
      },
    );

    await waitFor(() => getByTestId(TEST_IDS.noticeAssetWarning));
    expect(getByTestId(TEST_IDS.noticeAssetWarning).textContent).toMatchInlineSnapshot(
      '"Supplying XVS to the Venus pool will enable you to borrow tokens from this pool exclusively.Show tokens from the Venus pool"',
    );
  });

  it('submit is disabled with no amount', async () => {
    const { getByText } = renderComponent(
      <SupplyForm onCloseModal={noop} pool={fakePool} asset={fakeAsset} />,
      {
        accountAddress: fakeAccountAddress,
      },
    );

    await waitFor(() => getByText(en.operationModal.supply.submitButtonLabel.enterValidAmount));

    const disabledButtonText = getByText(
      en.operationModal.supply.submitButtonLabel.enterValidAmount,
    );
    expect(disabledButtonText).toHaveTextContent(
      en.operationModal.supply.submitButtonLabel.enterValidAmount,
    );
    const disabledButton = document.querySelector('button[type="submit"]');
    expect(disabledButton).toBeDisabled();
  });

  it('disables submit button if an amount entered in input is higher than token wallet balance', async () => {
    const customFakeAsset: Asset = {
      ...fakeAsset,
      userWalletBalanceTokens: new BigNumber(100),
    };

    const { getByText, getByTestId } = renderComponent(
      <SupplyForm onCloseModal={noop} pool={fakePool} asset={customFakeAsset} />,
      {
        accountAddress: fakeAccountAddress,
      },
    );

    await waitFor(() => getByText(en.operationModal.supply.submitButtonLabel.enterValidAmount));

    // Check submit button is disabled
    expect(
      getByText(en.operationModal.supply.submitButtonLabel.enterValidAmount).closest('button'),
    ).toBeDisabled();

    const incorrectValueTokens = customFakeAsset.userWalletBalanceTokens.plus(1).toFixed();

    // Enter amount in input
    const tokenTextInput = getByTestId(TEST_IDS.tokenTextField).closest(
      'input',
    ) as HTMLInputElement;

    fireEvent.change(tokenTextInput, {
      target: { value: incorrectValueTokens },
    });

    // Check submit button has a new label and is still disabled
    const expectedSubmitButtonLabel =
      en.operationModal.supply.submitButtonLabel.insufficientWalletBalance.replace(
        '{{tokenSymbol}}',
        fakeAsset.vToken.underlyingToken.symbol,
      );
    await waitFor(() => getByText(expectedSubmitButtonLabel));
    expect(getByText(expectedSubmitButtonLabel).closest('button')).toBeDisabled();
  });

  it('disables form and displays a warning notice if the supply cap of this market has been reached', async () => {
    const customFakeAsset: Asset = {
      ...fakeAsset,
      supplyCapTokens: new BigNumber(100),
      supplyBalanceTokens: new BigNumber(100),
    };

    const { getByText, getByTestId } = renderComponent(
      <SupplyForm onCloseModal={noop} pool={fakePool} asset={customFakeAsset} />,
      {
        accountAddress: fakeAccountAddress,
      },
    );

    // Check warning is displayed
    await waitFor(() => getByTestId(TEST_IDS.noticeError));
    expect(getByTestId(TEST_IDS.noticeError).textContent).toMatchInlineSnapshot(
      '"The supply cap of 100.00 XVS has been reached for this pool. You can not supply to this market anymore until withdraws are made or its supply cap is increased."',
    );

    // Check submit button is disabled
    expect(
      getByText(en.operationModal.supply.submitButtonLabel.supplyCapReached).closest('button'),
    ).toBeDisabled();

    // Check input is disabled
    expect(getByTestId(TEST_IDS.tokenTextField).closest('input')).toBeDisabled();
  });

  it('disables submit button and displays error notice if an amount entered in input is higher than asset supply cap', async () => {
    const customFakeAsset: Asset = {
      ...fakeAsset,
      supplyCapTokens: new BigNumber(100),
      supplyBalanceTokens: new BigNumber(10),
    };

    const { getByText, getByTestId } = renderComponent(
      <SupplyForm onCloseModal={noop} pool={fakePool} asset={customFakeAsset} />,
      {
        accountAddress: fakeAccountAddress,
      },
    );
    await waitFor(() => getByText(en.operationModal.supply.submitButtonLabel.enterValidAmount));

    // Check submit button is disabled
    expect(
      getByText(en.operationModal.supply.submitButtonLabel.enterValidAmount).closest('button'),
    ).toBeDisabled();

    const incorrectValueTokens = customFakeAsset
      .supplyCapTokens!.minus(customFakeAsset.supplyBalanceTokens)
      // Add one token too much
      .plus(1)
      .toFixed();

    // Enter amount in input
    const tokenTextInput = getByTestId(TEST_IDS.tokenTextField).closest(
      'input',
    ) as HTMLInputElement;
    fireEvent.change(tokenTextInput, {
      target: { value: incorrectValueTokens },
    });

    // Check error notice is displayed
    await waitFor(() => expect(getByTestId(TEST_IDS.noticeError)));
    expect(getByTestId(TEST_IDS.noticeError).textContent).toMatchInlineSnapshot(
      '"You can not supply more than 90.00 XVS to this pool, as the supply cap for this market is set at 100.00 XVS and 10.00 XVS are currently being supplied to it."',
    );

    // Check submit button is still disabled
    await waitFor(() =>
      getByText(en.operationModal.supply.submitButtonLabel.amountHigherThanSupplyCap),
    );
    expect(
      getByText(en.operationModal.supply.submitButtonLabel.amountHigherThanSupplyCap).closest(
        'button',
      ),
    ).toBeDisabled();
  });

  it('disables submit button and displays error notice if token has been approved but amount entered is higher than wallet spending limit', async () => {
    const originalTokenApprovalOutput = useTokenApproval({
      token: xvs,
      spenderAddress: vXvs.address,
      accountAddress: fakeAccountAddress,
    });

    const fakeWalletSpendingLimitTokens = new BigNumber(10);

    (useTokenApproval as Vi.Mock).mockImplementation(() => ({
      ...originalTokenApprovalOutput,
      walletSpendingLimitTokens: fakeWalletSpendingLimitTokens,
    }));

    const { getByText, getByTestId } = renderComponent(
      <SupplyForm onCloseModal={noop} pool={fakePool} asset={fakeAsset} />,
      {
        accountAddress: fakeAccountAddress,
      },
    );
    await waitFor(() => getByText(en.operationModal.supply.submitButtonLabel.enterValidAmount));

    // Check submit button is disabled
    expect(
      getByText(en.operationModal.supply.submitButtonLabel.enterValidAmount).closest('button'),
    ).toBeDisabled();

    const incorrectValueTokens = fakeWalletSpendingLimitTokens
      // Add one token too much
      .plus(1)
      .toFixed();

    // Enter amount in input
    const tokenTextInput = getByTestId(TEST_IDS.tokenTextField).closest(
      'input',
    ) as HTMLInputElement;
    fireEvent.change(tokenTextInput, {
      target: { value: incorrectValueTokens },
    });

    // Check error notice is displayed
    await waitFor(() => expect(getByText(en.operationModal.supply.amountAboveWalletSpendingLimit)));

    // Check submit button is still disabled
    await waitFor(() =>
      getByText(
        en.operationModal.supply.submitButtonLabel.amountHigherThanWalletWalletSpendingLimit,
      ),
    );
    expect(
      getByText(
        en.operationModal.supply.submitButtonLabel.amountHigherThanWalletWalletSpendingLimit,
      ).closest('button'),
    ).toBeDisabled();
  });

  it('displays the wallet spending limit correctly and lets user revoke it', async () => {
    const originalTokenApprovalOutput = useTokenApproval({
      token: xvs,
      spenderAddress: vXvs.address,
      accountAddress: fakeAccountAddress,
    });

    const fakeWalletSpendingLimitTokens = new BigNumber(10);
    const fakeRevokeWalletSpendingLimit = vi.fn();

    (useTokenApproval as Vi.Mock).mockImplementation(() => ({
      ...originalTokenApprovalOutput,
      revokeWalletSpendingLimit: fakeRevokeWalletSpendingLimit,
      walletSpendingLimitTokens: fakeWalletSpendingLimitTokens,
    }));

    const { getByTestId } = renderComponent(
      <SupplyForm onCloseModal={noop} pool={fakePool} asset={fakeAsset} />,
      {
        accountAddress: fakeAccountAddress,
      },
    );

    // Check spending limit is correctly displayedy
    await waitFor(() => getByTestId(TEST_IDS.spendingLimit));
    expect(getByTestId(TEST_IDS.spendingLimit).textContent).toMatchSnapshot();

    // Press on revoke button
    const revokeSpendingLimitButton = within(getByTestId(TEST_IDS.spendingLimit)).getByRole(
      'button',
    );

    fireEvent.click(revokeSpendingLimitButton);

    await waitFor(() => expect(fakeRevokeWalletSpendingLimit).toHaveBeenCalledTimes(1));
  });

  it('displays collateral switch and lets user enable asset as collateral if it has a positive collateral factor', async () => {
    const customFakeAsset: Asset = {
      ...fakeAsset,
      collateralFactor: 10,
      isCollateralOfUser: false,
    };

    const { toggleCollateral } = useCollateral();

    const { getByRole } = renderComponent(
      <SupplyForm onCloseModal={noop} pool={fakePool} asset={customFakeAsset} />,
      {
        accountAddress: fakeAccountAddress,
      },
    );

    await waitFor(() => getByRole('checkbox'));

    // Slide collateral switch
    const collateralSwitch = getByRole('checkbox');
    fireEvent.click(collateralSwitch);

    await waitFor(() => expect(toggleCollateral).toHaveBeenCalledTimes(1));
    expect(toggleCollateral).toHaveBeenCalledWith({
      asset: customFakeAsset,
      poolName: fakePool.name,
      comptrollerAddress: fakePool.comptrollerAddress,
    });
  });

  it('lets user supply BNB then calls onClose callback on success', async () => {
    const customFakeAsset: Asset = {
      ...fakeAsset,
      vToken: vBnb,
    };

    const onCloseModalMock = vi.fn();

    (supply as Vi.Mock).mockImplementationOnce(async () => fakeContractTransaction);

    const { getByTestId } = renderComponent(
      <SupplyForm onCloseModal={onCloseModalMock} pool={fakePool} asset={customFakeAsset} />,
      {
        accountAddress: fakeAccountAddress,
      },
    );

    const correctAmountTokens = fakeAsset.supplyCapTokens
      .minus(fakeAsset.supplyBalanceTokens)
      .minus(1);
    const tokenTextInput = getByTestId(TEST_IDS.tokenTextField).closest(
      'input',
    ) as HTMLInputElement;
    fireEvent.change(tokenTextInput, { target: { value: correctAmountTokens } });

    // Click on submit button
    const submitButton = document.querySelector('button[type="submit"]') as HTMLButtonElement;
    await waitFor(() =>
      expect(submitButton).toHaveTextContent(en.operationModal.supply.submitButtonLabel.supply),
    );
    fireEvent.click(submitButton);

    const expectedAmountMantissa = new BigNumber(correctAmountTokens).multipliedBy(
      new BigNumber(10).pow(customFakeAsset.vToken.underlyingToken.decimals),
    );

    await waitFor(() =>
      expect(supply).toHaveBeenCalledWith({ amountMantissa: expectedAmountMantissa }),
    );
    expect(onCloseModalMock).toHaveBeenCalledTimes(1);
  });

  it('lets user supply non-BNB tokens then calls onClose callback on success', async () => {
    const onCloseModalMock = vi.fn();

    (supply as Vi.Mock).mockImplementationOnce(async () => fakeContractTransaction);

    const { getByTestId } = renderComponent(
      <SupplyForm onCloseModal={onCloseModalMock} pool={fakePool} asset={fakeAsset} />,
      {
        accountAddress: fakeAccountAddress,
      },
    );

    const correctAmountTokens = fakeAsset.supplyCapTokens
      .minus(fakeAsset.supplyBalanceTokens)
      .minus(1);
    const tokenTextInput = await waitFor(() => getByTestId(TEST_IDS.tokenTextField));
    await waitFor(() => {
      fireEvent.change(tokenTextInput, { target: { value: correctAmountTokens } });
    });

    // Click on submit button
    const submitButton = document.querySelector('button[type="submit"]') as HTMLButtonElement;
    await waitFor(() =>
      expect(submitButton).toHaveTextContent(en.operationModal.supply.submitButtonLabel.supply),
    );
    fireEvent.click(submitButton);

    const expectedAmountMantissa = new BigNumber(correctAmountTokens).multipliedBy(
      new BigNumber(10).pow(fakeAsset.vToken.underlyingToken.decimals),
    );

    await waitFor(() =>
      expect(supply).toHaveBeenCalledWith({ amountMantissa: expectedAmountMantissa }),
    );
    expect(onCloseModalMock).toHaveBeenCalledTimes(1);
  });
});
