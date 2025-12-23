import { fireEvent, waitFor, within } from '@testing-library/react';
import BigNumber from 'bignumber.js';
import type { Mock } from 'vitest';

import fakeAccountAddress from '__mocks__/models/address';
import { xvs } from '__mocks__/models/tokens';
import { vBnb, vXvs } from '__mocks__/models/vTokens';
import { renderComponent } from 'testUtils/render';

import { useSupply } from 'clients/api';
import { useCollateral } from 'hooks/useCollateral';
import useTokenApproval from 'hooks/useTokenApproval';
import { en } from 'libs/translations';
import type { Asset, AssetBalanceMutation } from 'types';

import MAX_UINT256 from 'constants/maxUint256';
import { useSimulateBalanceMutations } from 'hooks/useSimulateBalanceMutations';
import SupplyForm from '..';
import {
  checkSubmitButtonIsDisabled,
  checkSubmitButtonIsEnabled,
} from '../../__testUtils__/checkFns';
import type { FormError } from '../../types';
import { useCommonValidation } from '../../useCommonValidation';
import { fakeAsset, fakePool } from '../__testUtils__/fakeData';
import TEST_IDS from '../testIds';

vi.mock('hooks/useCollateral');
vi.mock('hooks/useTokenApproval');
vi.mock('../../useCommonValidation');

const mockSupply = vi.fn();

describe('SupplyForm', () => {
  beforeEach(() => {
    (useSupply as Mock).mockReturnValue({ mutateAsync: mockSupply });
  });

  it('displays correct wallet balance amount', async () => {
    const { getByText } = renderComponent(<SupplyForm pool={fakePool} asset={fakeAsset} />, {
      accountAddress: fakeAccountAddress,
    });

    await waitFor(() => getByText('10M XVS'));
  });

  it('submit is disabled with no amount', async () => {
    renderComponent(<SupplyForm pool={fakePool} asset={fakeAsset} />, {
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
      <SupplyForm pool={fakePool} asset={customFakeAsset} />,
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
    const fakeError: FormError = {
      code: 'SUPPLY_CAP_ALREADY_REACHED',
      message: en.operationForm.error.supplyCapReached.replace('{{assetSupplyCap}}', '100 XVS'),
    };

    (useCommonValidation as Mock).mockReturnValue(fakeError);

    const { getByText, getByTestId } = renderComponent(
      <SupplyForm pool={fakePool} asset={fakeAsset} />,
      {
        accountAddress: fakeAccountAddress,
      },
    );

    // Check warning is displayed
    await waitFor(() =>
      expect(
        getByText(en.operationForm.error.supplyCapReached.replace('{{assetSupplyCap}}', '100 XVS')),
      ).toBeInTheDocument(),
    );

    // Check input is disabled
    expect(getByTestId(TEST_IDS.tokenTextField).closest('input')).toBeDisabled();

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

    (useTokenApproval as Mock).mockImplementation(() => ({
      ...originalTokenApprovalOutput,
      walletSpendingLimitTokens: fakeWalletSpendingLimitTokens,
    }));

    const { getByText, getByTestId } = renderComponent(
      <SupplyForm pool={fakePool} asset={fakeAsset} />,
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

    (useTokenApproval as Mock).mockImplementation(() => ({
      ...originalTokenApprovalOutput,
      revokeWalletSpendingLimit: fakeRevokeWalletSpendingLimit,
      walletSpendingLimitTokens: fakeWalletSpendingLimitTokens,
    }));

    const { getByTestId } = renderComponent(<SupplyForm pool={fakePool} asset={fakeAsset} />, {
      accountAddress: fakeAccountAddress,
    });

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
      userCollateralFactor: 10,
      isCollateralOfUser: false,
    };

    const { toggleCollateral } = useCollateral();

    const { getByRole } = renderComponent(<SupplyForm pool={fakePool} asset={customFakeAsset} />, {
      accountAddress: fakeAccountAddress,
    });

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
      supplyCapTokens: MAX_UINT256,
    };

    const { getByText, getByTestId } = renderComponent(
      <SupplyForm asset={customFakeAsset} pool={fakePool} />,
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
    await checkSubmitButtonIsEnabled({
      textContent: en.operationForm.submitButtonLabel.supply,
    });
  });

  it('updates input value to maximum suppliable amount when clicking on max button if supply cap does not permit supplying the entire wallet balance', async () => {
    const customFakeAsset: Asset = {
      ...fakeAsset,
      userWalletBalanceTokens: new BigNumber(95),
      supplyBalanceTokens: new BigNumber(10),
      supplyCapTokens: new BigNumber(100),
    };

    const { getByText, getByTestId } = renderComponent(
      <SupplyForm asset={customFakeAsset} pool={fakePool} />,
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
    await checkSubmitButtonIsEnabled({
      textContent: en.operationForm.submitButtonLabel.supply,
    });
  });

  it('lets user supply BNB', async () => {
    const customFakeAsset: Asset = {
      ...fakeAsset,
      vToken: vBnb,
    };

    const { getByTestId } = renderComponent(
      <SupplyForm pool={fakePool} asset={customFakeAsset} />,
      {
        accountAddress: fakeAccountAddress,
      },
    );

    const correctAmountTokens = customFakeAsset.supplyCapTokens
      .minus(customFakeAsset.supplyBalanceTokens)
      .minus(1);
    const tokenTextInput = await waitFor(
      () => getByTestId(TEST_IDS.tokenTextField) as HTMLInputElement,
    );
    fireEvent.change(tokenTextInput, { target: { value: correctAmountTokens } });

    // Check generated balance mutations are accurate
    const expectedBalanceMutations: AssetBalanceMutation[] = [
      {
        type: 'asset',
        action: 'supply',
        vTokenAddress: customFakeAsset.vToken.address,
        amountTokens: correctAmountTokens,
      },
    ];

    expect(useSimulateBalanceMutations).toHaveBeenCalledWith({
      pool: fakePool,
      balanceMutations: expectedBalanceMutations,
    });

    // Click on submit button
    const submitButton = document.querySelector('button[type="submit"]') as HTMLButtonElement;
    await waitFor(() =>
      expect(submitButton).toHaveTextContent(en.operationForm.submitButtonLabel.supply),
    );
    fireEvent.click(submitButton);

    await waitFor(() =>
      expect(mockSupply.mock.calls[0]).toMatchInlineSnapshot(`
        [
          {
            "amountMantissa": "8.899e+21",
            "poolName": "Venus",
            "vToken": {
              "address": "0x2E7222e51c0f6e98610A1543Aa3836E092CDe62c",
              "decimals": 8,
              "symbol": "vBNB",
              "underlyingToken": {
                "address": "0xbBbBBBBbbBBBbbbBbbBbbbbBBbBbbbbBbBbbBBbB",
                "decimals": 18,
                "iconSrc": "fake-bnb-asset",
                "isNative": true,
                "symbol": "BNB",
              },
            },
          },
        ]
      `),
    );
  });

  it('lets user supply non-BNB tokens', async () => {
    const { getByTestId } = renderComponent(<SupplyForm pool={fakePool} asset={fakeAsset} />, {
      accountAddress: fakeAccountAddress,
    });

    const correctAmountTokens = fakeAsset.supplyCapTokens
      .minus(fakeAsset.supplyBalanceTokens)
      .minus(1);
    const tokenTextInput = await waitFor(() => getByTestId(TEST_IDS.tokenTextField));
    await waitFor(() => {
      fireEvent.change(tokenTextInput, { target: { value: correctAmountTokens } });
    });

    // Check generated balance mutations are accurate
    const expectedBalanceMutations: AssetBalanceMutation[] = [
      {
        type: 'asset',
        action: 'supply',
        vTokenAddress: fakeAsset.vToken.address,
        amountTokens: correctAmountTokens,
      },
    ];

    expect(useSimulateBalanceMutations).toHaveBeenCalledWith({
      pool: fakePool,
      balanceMutations: expectedBalanceMutations,
    });

    // Click on submit button
    const submitButton = document.querySelector('button[type="submit"]') as HTMLButtonElement;
    await waitFor(() =>
      expect(submitButton).toHaveTextContent(en.operationForm.submitButtonLabel.supply),
    );
    fireEvent.click(submitButton);

    await waitFor(() =>
      expect(mockSupply.mock.calls[0]).toMatchInlineSnapshot(`
        [
          {
            "amountMantissa": "8.899e+21",
            "poolName": "Venus",
            "vToken": {
              "address": "0x6d6F697e34145Bb95c54E77482d97cc261Dc237E",
              "decimals": 8,
              "symbol": "vXVS",
              "underlyingToken": {
                "address": "0xB9e0E753630434d7863528cc73CB7AC638a7c8ff",
                "decimals": 18,
                "iconSrc": "fake-xvs-asset",
                "symbol": "XVS",
              },
            },
          },
        ]
      `),
    );
  });
});
