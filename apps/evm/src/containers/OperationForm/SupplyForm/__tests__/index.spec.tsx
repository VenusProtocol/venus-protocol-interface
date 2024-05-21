import { fireEvent, waitFor, within } from '@testing-library/react';
import BigNumber from 'bignumber.js';
import noop from 'noop-ts';
import type Vi from 'vitest';

import fakeAccountAddress from '__mocks__/models/address';
import fakeContractTransaction from '__mocks__/models/contractTransaction';
import { xvs } from '__mocks__/models/tokens';
import { vBnb, vXvs } from '__mocks__/models/vTokens';
import { renderComponent } from 'testUtils/render';

import { supply } from 'clients/api';
import useCollateral from 'hooks/useCollateral';
import useTokenApproval from 'hooks/useTokenApproval';
import { en } from 'libs/translations';
import type { Asset } from 'types';

import SupplyForm from '..';
import { fakeAsset, fakePool } from '../__testUtils__/fakeData';
import TEST_IDS from '../testIds';

vi.mock('hooks/useCollateral');
vi.mock('hooks/useTokenApproval');

const checkSubmitButtonIsDisabled = async () => {
  const submitButton = document.querySelector('button[type="submit"]') as HTMLButtonElement;
  await waitFor(() =>
    expect(submitButton).toHaveTextContent(en.operationForm.submitButtonLabel.enterValidAmount),
  );
  expect(submitButton).toBeDisabled();
};

const checkSubmitButtonIsEnabled = async () => {
  const submitButton = document.querySelector('button[type="submit"]') as HTMLButtonElement;
  await waitFor(() =>
    expect(submitButton).toHaveTextContent(en.operationForm.submitButtonLabel.supply),
  );
  expect(submitButton).toBeEnabled();
};

describe('SupplyForm', () => {
  it('displays correct suppliable amount', async () => {
    const { getByText } = renderComponent(
      <SupplyForm onSubmitSuccess={noop} pool={fakePool} asset={fakeAsset} />,
      {
        accountAddress: fakeAccountAddress,
      },
    );

    await waitFor(() => getByText('8.90K XVS'));
  });

  it('submit is disabled with no amount', async () => {
    renderComponent(<SupplyForm onSubmitSuccess={noop} pool={fakePool} asset={fakeAsset} />, {
      accountAddress: fakeAccountAddress,
    });

    await checkSubmitButtonIsDisabled();
  });

  it('disables submit button if an amount entered in input is higher than token wallet balance', async () => {
    const customFakeAsset: Asset = {
      ...fakeAsset,
      userWalletBalanceTokens: new BigNumber(100),
    };

    const { getByTestId, getByText } = renderComponent(
      <SupplyForm onSubmitSuccess={noop} pool={fakePool} asset={customFakeAsset} />,
      {
        accountAddress: fakeAccountAddress,
      },
    );

    const incorrectValueTokens = customFakeAsset.userWalletBalanceTokens.plus(1).toFixed();

    // Enter amount in input
    const tokenTextInput = await waitFor(() => getByTestId(TEST_IDS.tokenTextField));

    fireEvent.change(tokenTextInput, {
      target: { value: incorrectValueTokens },
    });

    // Check error is displayed
    await waitFor(() =>
      expect(
        getByText(
          en.operationForm.error.higherThanWalletBalance.replace(
            '{{tokenSymbol}}',
            customFakeAsset.vToken.underlyingToken.symbol,
          ),
        ),
      ).toBeInTheDocument(),
    );

    // Check submit button is disabled
    await checkSubmitButtonIsDisabled();
  });

  it('disables form and displays a warning notice if the supply cap of this market has been reached', async () => {
    const customFakeAsset: Asset = {
      ...fakeAsset,
      supplyCapTokens: new BigNumber(100),
      supplyBalanceTokens: new BigNumber(100),
    };

    const { getByText, getByTestId } = renderComponent(
      <SupplyForm onSubmitSuccess={noop} pool={fakePool} asset={customFakeAsset} />,
      {
        accountAddress: fakeAccountAddress,
      },
    );

    // Check warning is displayed
    await waitFor(() =>
      expect(
        getByText(
          en.operationForm.error.supplyCapReached.replace('{{assetSupplyCap}}', '100.00 XVS'),
        ),
      ).toBeInTheDocument(),
    );

    // Check input is disabled
    expect(getByTestId(TEST_IDS.tokenTextField).closest('input')).toBeDisabled();

    // Check submit button is disabled
    await checkSubmitButtonIsDisabled();
  });

  it('disables submit button and displays error notice if an amount entered in input is higher than asset supply cap', async () => {
    const customFakeAsset: Asset = {
      ...fakeAsset,
      supplyCapTokens: new BigNumber(100),
      supplyBalanceTokens: new BigNumber(10),
    };

    const { getByTestId, getByText } = renderComponent(
      <SupplyForm onSubmitSuccess={noop} pool={fakePool} asset={customFakeAsset} />,
      {
        accountAddress: fakeAccountAddress,
      },
    );

    const incorrectValueTokens = customFakeAsset
      .supplyCapTokens!.minus(customFakeAsset.supplyBalanceTokens)
      // Add one token too much
      .plus(1)
      .toFixed();

    // Enter amount in input
    const tokenTextInput = await waitFor(() => getByTestId(TEST_IDS.tokenTextField));

    fireEvent.change(tokenTextInput, {
      target: { value: incorrectValueTokens },
    });

    // Check error is displayed
    await waitFor(() =>
      expect(
        getByText(
          en.operationForm.error.higherThanSupplyCap
            .replace('{{userMaxSupplyAmount}}', '90.00 XVS')
            .replace('{{assetSupplyCap}}', '100.00 XVS')
            .replace('{{assetSupplyBalance}}', '10.00 XVS'),
        ),
      ).toBeInTheDocument(),
    );

    // Check submit button is disabled
    await checkSubmitButtonIsDisabled();
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
      <SupplyForm onSubmitSuccess={noop} pool={fakePool} asset={fakeAsset} />,
      {
        accountAddress: fakeAccountAddress,
      },
    );

    const incorrectValueTokens = fakeWalletSpendingLimitTokens
      // Add one token too much
      .plus(1)
      .toFixed();

    // Enter amount in input
    const tokenTextInput = await waitFor(() => getByTestId(TEST_IDS.tokenTextField));

    fireEvent.change(tokenTextInput, {
      target: { value: incorrectValueTokens },
    });

    // Check error is displayed
    await waitFor(() =>
      expect(getByText(en.operationForm.error.higherThanWalletSpendingLimit)).toBeInTheDocument(),
    );

    // Check submit button is still disabled
    await checkSubmitButtonIsDisabled();
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
      <SupplyForm onSubmitSuccess={noop} pool={fakePool} asset={fakeAsset} />,
      {
        accountAddress: fakeAccountAddress,
      },
    );

    // Check spending limit is correctly displayed
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
      <SupplyForm onSubmitSuccess={noop} pool={fakePool} asset={customFakeAsset} />,
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

  it('updates input value to wallet balance when clicking on max button if supply cap permits it', async () => {
    const customFakeAsset: Asset = {
      ...fakeAsset,
      supplyCapTokens: undefined,
    };

    const { getByText, getByTestId } = renderComponent(
      <SupplyForm asset={customFakeAsset} pool={fakePool} onSubmitSuccess={noop} />,
      {
        accountAddress: fakeAccountAddress,
      },
    );

    const tokenTextInput = await waitFor(
      () => getByTestId(TEST_IDS.tokenTextField) as HTMLInputElement,
    );

    // Click on max button
    fireEvent.click(getByText(en.operationForm.rightMaxButtonLabel));

    // Check input value was updated correctly
    await waitFor(() =>
      expect(tokenTextInput.value).toBe(customFakeAsset.userWalletBalanceTokens.toFixed()),
    );

    // Check submit button is enabled
    await checkSubmitButtonIsEnabled();
  });

  it('updates input value to maximum suppliable amount when clicking on max button if supply cap does not permit supplying the entire wallet balance', async () => {
    const customFakeAsset: Asset = {
      ...fakeAsset,
      userWalletBalanceTokens: new BigNumber(95),
      supplyBalanceTokens: new BigNumber(10),
      supplyCapTokens: new BigNumber(100),
    };

    const { getByText, getByTestId } = renderComponent(
      <SupplyForm asset={customFakeAsset} pool={fakePool} onSubmitSuccess={noop} />,
      {
        accountAddress: fakeAccountAddress,
      },
    );

    const tokenTextInput = await waitFor(
      () => getByTestId(TEST_IDS.tokenTextField) as HTMLInputElement,
    );

    // Click on max button
    fireEvent.click(getByText(en.operationForm.rightMaxButtonLabel));

    // Check input value was updated correctly
    await waitFor(() =>
      expect(tokenTextInput.value).toBe(
        customFakeAsset.supplyCapTokens!.minus(customFakeAsset.supplyBalanceTokens).toFixed(),
      ),
    );

    // Check submit button is enabled
    await checkSubmitButtonIsEnabled();
  });

  it('lets user supply BNB then calls onClose callback on success', async () => {
    const customFakeAsset: Asset = {
      ...fakeAsset,
      vToken: vBnb,
    };

    const onSubmitSuccessMock = vi.fn();

    (supply as Vi.Mock).mockImplementationOnce(async () => fakeContractTransaction);

    const { getByTestId } = renderComponent(
      <SupplyForm onSubmitSuccess={onSubmitSuccessMock} pool={fakePool} asset={customFakeAsset} />,
      {
        accountAddress: fakeAccountAddress,
      },
    );

    const correctAmountTokens = fakeAsset.supplyCapTokens
      .minus(fakeAsset.supplyBalanceTokens)
      .minus(1);
    const tokenTextInput = await waitFor(
      () => getByTestId(TEST_IDS.tokenTextField) as HTMLInputElement,
    );
    fireEvent.change(tokenTextInput, { target: { value: correctAmountTokens } });

    // Click on submit button
    const submitButton = document.querySelector('button[type="submit"]') as HTMLButtonElement;
    await waitFor(() =>
      expect(submitButton).toHaveTextContent(en.operationForm.submitButtonLabel.supply),
    );
    fireEvent.click(submitButton);

    const expectedAmountMantissa = new BigNumber(correctAmountTokens).multipliedBy(
      new BigNumber(10).pow(customFakeAsset.vToken.underlyingToken.decimals),
    );

    await waitFor(() =>
      expect(supply).toHaveBeenCalledWith({ amountMantissa: expectedAmountMantissa }),
    );
    expect(onSubmitSuccessMock).toHaveBeenCalledTimes(1);
  });

  it('lets user supply non-BNB tokens then calls onClose callback on success', async () => {
    const onSubmitSuccessMock = vi.fn();

    (supply as Vi.Mock).mockImplementationOnce(async () => fakeContractTransaction);

    const { getByTestId } = renderComponent(
      <SupplyForm onSubmitSuccess={onSubmitSuccessMock} pool={fakePool} asset={fakeAsset} />,
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
      expect(submitButton).toHaveTextContent(en.operationForm.submitButtonLabel.supply),
    );
    fireEvent.click(submitButton);

    const expectedAmountMantissa = new BigNumber(correctAmountTokens).multipliedBy(
      new BigNumber(10).pow(fakeAsset.vToken.underlyingToken.decimals),
    );

    await waitFor(() =>
      expect(supply).toHaveBeenCalledWith({ amountMantissa: expectedAmountMantissa }),
    );
    expect(onSubmitSuccessMock).toHaveBeenCalledTimes(1);
  });
});
