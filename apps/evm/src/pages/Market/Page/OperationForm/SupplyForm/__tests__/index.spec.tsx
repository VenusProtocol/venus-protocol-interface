import { fireEvent, waitFor, within } from '@testing-library/react';
import BigNumber from 'bignumber.js';
import noop from 'noop-ts';
import type { Mock } from 'vitest';

import fakeAccountAddress from '__mocks__/models/address';
import { xvs } from '__mocks__/models/tokens';
import { vBnb, vXvs } from '__mocks__/models/vTokens';
import { renderComponent } from 'testUtils/render';

import { useSupply } from 'clients/api';
import useCollateral from 'hooks/useCollateral';
import useTokenApproval from 'hooks/useTokenApproval';
import { en } from 'libs/translations';
import { type Asset, ChainId } from 'types';

import { chainMetadata } from '@venusprotocol/chains';
import MAX_UINT256 from 'constants/maxUint256';
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

const mockSupply = vi.fn();

describe('SupplyForm', () => {
  beforeEach(() => {
    (useSupply as Mock).mockReturnValue({ mutateAsync: mockSupply });
  });

  it('prompts user to connect their wallet if they are not connected', async () => {
    const { getByText, getByTestId, getByRole } = renderComponent(
      <SupplyForm onSubmitSuccess={noop} pool={fakePool} asset={fakeAsset} />,
    );

    // Check "Connect wallet" button is displayed
    expect(getByText(en.connectWallet.connectButton)).toBeInTheDocument();

    // Check collateral switch is disabled
    expect(getByRole('checkbox')).toBeDisabled();

    // Check input is disabled
    expect(getByTestId(TEST_IDS.tokenTextField).closest('input')).toBeDisabled();
  });

  it('displays correct wallet balance amount', async () => {
    const { getByText } = renderComponent(
      <SupplyForm onSubmitSuccess={noop} pool={fakePool} asset={fakeAsset} />,
      {
        accountAddress: fakeAccountAddress,
      },
    );

    await waitFor(() => getByText('10M XVS'));
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
        getByText(en.operationForm.error.supplyCapReached.replace('{{assetSupplyCap}}', '100 XVS')),
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
            .replace('{{userMaxSupplyAmount}}', '90 XVS')
            .replace('{{assetSupplyCap}}', '100 XVS')
            .replace('{{assetSupplyBalance}}', '10 XVS'),
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

    (useTokenApproval as Mock).mockImplementation(() => ({
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

  it('prompts user to switch chain if they are connected to the wrong one', async () => {
    const { queryAllByText, getByTestId } = renderComponent(
      <SupplyForm onSubmitSuccess={noop} pool={fakePool} asset={fakeAsset} />,
      {
        accountAddress: fakeAccountAddress,
        accountChainId: ChainId.ARBITRUM_ONE,
        chainId: ChainId.BSC_TESTNET,
      },
    );

    const correctAmountTokens = 1;

    const tokenTextInput = await waitFor(() => getByTestId(TEST_IDS.tokenTextField));
    fireEvent.change(tokenTextInput, { target: { value: correctAmountTokens } });

    // Check "Switch chain" button is displayed
    await waitFor(() =>
      expect(
        queryAllByText(
          en.switchChain.switchButton.replace(
            '{{chainName}}',
            chainMetadata[ChainId.BSC_TESTNET].name,
          ),
        ).length,
      ).toBeTruthy(),
    );
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
      supplyCapTokens: MAX_UINT256,
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

    const { getByTestId } = renderComponent(
      <SupplyForm onSubmitSuccess={onSubmitSuccessMock} pool={fakePool} asset={customFakeAsset} />,
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

    // Click on submit button
    const submitButton = document.querySelector('button[type="submit"]') as HTMLButtonElement;
    await waitFor(() =>
      expect(submitButton).toHaveTextContent(en.operationForm.submitButtonLabel.supply),
    );
    fireEvent.click(submitButton);

    await waitFor(() => expect(mockSupply.mock.calls[0]).toMatchInlineSnapshot(`
      [
        {
          "amountMantissa": "8.899e+21",
          "poolName": "Venus",
          "vToken": {
            "address": "0x2E7222e51c0f6e98610A1543Aa3836E092CDe62c",
            "decimals": 8,
            "symbol": "vBNB",
            "underlyingToken": {
              "address": "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE",
              "asset": "data:image/svg+xml,%3csvg%20xmlns='http://www.w3.org/2000/svg'%20width='24'%20height='24'%20fill='none'%20xmlns:v='https://vecta.io/nano'%3e%3cg%20clip-path='url(%23A)'%3e%3cg%20clip-path='url(%23B)'%3e%3cpath%20fill-rule='evenodd'%20d='M12%200a12%2012%200%201%201%200%2024%2012%2012%200%201%201%200-24z'%20fill='%23f0b90b'/%3e%3cg%20fill='%23fff'%3e%3cpath%20d='M6.595%2012l.009%203.173L9.3%2016.76v1.858l-4.274-2.507v-5.039L6.595%2012zm0-3.173v1.849l-1.57-.929V7.898l1.57-.929%201.578.929-1.578.929zm3.831-.929l1.57-.929%201.578.929-1.578.929-1.57-.929zM7.73%2014.515v-1.858l1.57.929v1.849l-1.57-.92zm2.696%202.91l1.57.929%201.578-.929v1.849l-1.578.929-1.57-.929v-1.849zm5.4-9.527l1.57-.929%201.578.929v1.849l-1.578.929V8.827l-1.57-.929zm1.57%207.275L17.405%2012l1.57-.929v5.038l-4.274%202.507v-1.858l2.695-1.586zm-1.126-.658l-1.57.92v-1.849l1.57-.929v1.858zm0-5.03l.009%201.858-2.704%201.587v3.181l-1.57.92-1.57-.92V12.93l-2.704-1.587V9.485l1.577-.929%202.687%201.594%202.704-1.594%201.578.929h-.007zM7.73%206.313l4.266-2.515%204.274%202.515-1.57.929-2.704-1.594L9.3%207.241l-1.57-.929z'/%3e%3c/g%3e%3c/g%3e%3c/g%3e%3cdefs%3e%3cclipPath%20id='A'%3e%3cpath%20fill='%23fff'%20d='M0%200h24v24H0z'/%3e%3c/clipPath%3e%3cclipPath%20id='B'%3e%3cpath%20fill='%23fff'%20d='M0%200h24v24H0z'/%3e%3c/clipPath%3e%3c/defs%3e%3c/svg%3e",
              "decimals": 18,
              "isNative": true,
              "symbol": "BNB",
            },
          },
        },
      ]
    `));
    expect(onSubmitSuccessMock).toHaveBeenCalledTimes(1);
  });

  it('lets user supply non-BNB tokens then calls onClose callback on success', async () => {
    const onSubmitSuccessMock = vi.fn();

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
              "asset": "data:image/svg+xml,%3csvg%20xmlns='http://www.w3.org/2000/svg'%20width='24'%20height='24'%20fill='none'%20xmlns:v='https://vecta.io/nano'%3e%3cg%20clip-path='url(%23B)'%3e%3ccircle%20cx='12'%20cy='12'%20r='12'%20fill='%231f2028'/%3e%3cpath%20d='M18.957%209.442l-5.27%209.128c-.159.275-.388.504-.664.663s-.588.243-.906.243-.631-.084-.906-.243-.505-.387-.664-.663l-.924-1.599c-.003-.019%200-.023.004-.026.019-.003.023%200%20.026.004a1.52%201.52%200%200%200%201.267.425%201.52%201.52%200%200%200%20.642-.241c.193-.128.354-.299.47-.499l4.412-7.649a1.52%201.52%200%200%200%20.086-1.341%201.52%201.52%200%200%200-1.012-.884c-.017-.009-.019-.014-.019-.019.009-.017.014-.019.019-.019h1.87c.318%200%20.631.084.906.244s.504.388.663.664.243.588.242.907-.084.631-.243.907zm-6.239-2.721h-1.827c-.012.01-.013.014-.013.018.006.014.009.017.013.018.123.048.234.121.326.216s.163.208.207.332.061.257.049.388-.051.259-.117.373l-2.663%204.606a.92.92%200%200%201-.648.441.92.92%200%200%201-.752-.22c-.017-.008-.022-.007-.026-.004-.008.017-.007.022-.004.026l.935%201.623c.105.182.256.333.438.439s.389.161.599.161.417-.055.599-.161.333-.257.438-.439l3.484-6.022c.105-.182.16-.389.16-.599s-.055-.417-.161-.599-.257-.333-.439-.438-.389-.16-.599-.16zm-6.342%200c-.312%200-.617.092-.876.266s-.461.419-.581.708-.151.605-.09.911.211.587.431.807.501.371.807.431.623.03.911-.09.534-.321.708-.581.266-.564.266-.876c0-.207-.04-.412-.12-.604s-.195-.365-.342-.512-.32-.263-.512-.342-.396-.12-.604-.12z'%20fill='url(%23A)'/%3e%3c/g%3e%3cdefs%3e%3clinearGradient%20id='A'%20x1='19.016'%20y1='16.814'%20x2='2.55'%20y2='5.633'%20gradientUnits='userSpaceOnUse'%3e%3cstop%20stop-color='%235433ff'/%3e%3cstop%20offset='.5'%20stop-color='%2320bdff'/%3e%3cstop%20offset='1'%20stop-color='%235cffa2'/%3e%3c/linearGradient%3e%3cclipPath%20id='B'%3e%3cpath%20fill='%23fff'%20d='M0%200h24v24H0z'/%3e%3c/clipPath%3e%3c/defs%3e%3c/svg%3e",
              "decimals": 18,
              "symbol": "XVS",
            },
          },
        },
      ]
    `),
    );

    expect(onSubmitSuccessMock).toHaveBeenCalledTimes(1);
  });
});
