import { fireEvent, waitFor } from '@testing-library/react';
import BigNumber from 'bignumber.js';
import noop from 'noop-ts';
import type { Mock } from 'vitest';

import fakeAccountAddress from '__mocks__/models/address';
import { eth } from '__mocks__/models/tokens';
import { renderComponent } from 'testUtils/render';

import { useGetBalanceOf, useSupply } from 'clients/api';
import { selectToken } from 'components/SelectTokenTextField/__testUtils__/testUtils';
import { getTokenTextFieldTestId } from 'components/SelectTokenTextField/testIdGetters';
import { type UseIsFeatureEnabledInput, useIsFeatureEnabled } from 'hooks/useIsFeatureEnabled';
import { en } from 'libs/translations';
import { type Asset, ChainId } from 'types';

import MAX_UINT256 from 'constants/maxUint256';
import Supply from '..';
import { fakeAsset, fakePool, fakeWethAsset } from '../__testUtils__/fakeData';
import TEST_IDS from '../testIds';

const fakeNativeTokenBalanceTokens = new BigNumber(10);
const fakeBalanceMantissa = fakeNativeTokenBalanceTokens.multipliedBy(10 ** 18);

const mockSupply = vi.fn();

describe('SupplyForm - Feature flag enabled: wrapUnwrapNativeToken', () => {
  beforeEach(() => {
    (useIsFeatureEnabled as Mock).mockImplementation(
      ({ name }: UseIsFeatureEnabledInput) => name === 'wrapUnwrapNativeToken',
    );

    (useGetBalanceOf as Mock).mockImplementation(() => ({
      data: {
        balanceMantissa: fakeBalanceMantissa,
      },
      isLoading: false,
    }));

    (useSupply as Mock).mockReturnValue({ mutateAsync: mockSupply });
  });

  it('renders without crashing', () => {
    renderComponent(
      <Supply
        asset={fakeAsset}
        pool={fakePool}
        onSubmitSuccess={noop}
        userTokenWrappedBalanceMantissa={fakeBalanceMantissa}
      />,
      {
        chainId: ChainId.SEPOLIA,
      },
    );
  });

  it('does not display the token selector if the underlying token does not wrap the chain native token', async () => {
    const { queryByTestId } = renderComponent(
      <Supply
        asset={fakeAsset}
        pool={fakePool}
        onSubmitSuccess={noop}
        userTokenWrappedBalanceMantissa={fakeBalanceMantissa}
      />,
      {
        chainId: ChainId.SEPOLIA,
        accountAddress: fakeAccountAddress,
      },
    );

    expect(queryByTestId(TEST_IDS.selectTokenTextField)).toBeNull();
  });

  it('displays the token selector if the underlying token wraps the chain native token', async () => {
    const { queryByTestId } = renderComponent(
      <Supply
        asset={fakeWethAsset}
        pool={fakePool}
        onSubmitSuccess={noop}
        userTokenWrappedBalanceMantissa={fakeBalanceMantissa}
      />,
      {
        chainId: ChainId.SEPOLIA,
        accountAddress: fakeAccountAddress,
      },
    );

    expect(queryByTestId(TEST_IDS.selectTokenTextField)).toBeVisible();
  });

  it('updates input value to wallet balance when clicking on MAX button if supply cap permits it', async () => {
    const customFakeAsset: Asset = {
      ...fakeWethAsset,
      supplyCapTokens: MAX_UINT256,
    };

    const { container, getByTestId, queryByTestId, getByText } = renderComponent(
      <Supply
        asset={customFakeAsset}
        pool={fakePool}
        onSubmitSuccess={noop}
        userTokenWrappedBalanceMantissa={fakeBalanceMantissa}
      />,
      {
        chainId: ChainId.SEPOLIA,
        accountAddress: fakeAccountAddress,
      },
    );

    await waitFor(() => expect(queryByTestId(TEST_IDS.selectTokenTextField)).toBeVisible());

    selectToken({
      container,
      selectTokenTextFieldTestId: TEST_IDS.selectTokenTextField,
      token: eth,
    });

    // Click on MAX button
    fireEvent.click(getByText(en.operationForm.rightMaxButtonLabel));

    // Check input value was updated correctly
    const selectTokenTextField = getByTestId(
      getTokenTextFieldTestId({
        parentTestId: TEST_IDS.selectTokenTextField,
      }),
    ) as HTMLInputElement;

    await waitFor(() =>
      expect(selectTokenTextField.value).toBe(fakeNativeTokenBalanceTokens.toFixed()),
    );

    // Check submit button is enabled
    const submitButton = document.querySelector('button[type="submit"]') as HTMLButtonElement;
    await waitFor(() =>
      expect(submitButton).toHaveTextContent(en.operationForm.submitButtonLabel.supply),
    );
    expect(submitButton).toBeEnabled();
  });

  it('lets user wrap and supply, then calls onClose callback on success', async () => {
    const amountTokensToSupply = new BigNumber('1');

    const onCloseMock = vi.fn();
    const { container, getByTestId, queryByTestId, getByText } = renderComponent(
      <Supply
        asset={fakeWethAsset}
        pool={fakePool}
        onSubmitSuccess={onCloseMock}
        userTokenWrappedBalanceMantissa={fakeBalanceMantissa}
      />,
      {
        chainId: ChainId.SEPOLIA,
        accountAddress: fakeAccountAddress,
      },
    );

    await waitFor(() => expect(queryByTestId(TEST_IDS.selectTokenTextField)).toBeVisible());

    selectToken({
      container,
      selectTokenTextFieldTestId: TEST_IDS.selectTokenTextField,
      token: eth,
    });

    const selectTokenTextField = getByTestId(
      getTokenTextFieldTestId({
        parentTestId: TEST_IDS.selectTokenTextField,
      }),
    ) as HTMLInputElement;

    // Enter valid amount in input
    fireEvent.change(selectTokenTextField, { target: { value: amountTokensToSupply.toString() } });

    // Click on submit button
    const submitButton = await waitFor(() => getByText(en.operationForm.submitButtonLabel.supply));
    expect(submitButton).toBeEnabled();
    fireEvent.click(submitButton);

    await waitFor(() => expect(mockSupply).toHaveBeenCalledTimes(1));
    expect(mockSupply.mock.calls[0]).toMatchInlineSnapshot(`
      [
        {
          "amountMantissa": "1000000000000000000",
          "poolComptrollerContractAddress": "0x94d1820b2d1c7c7452a163983dc888cec546b77d",
          "poolName": "Venus",
          "vToken": {
            "address": "0x6d6F697e34145Bb95c54E77482d97cc261Dc237E",
            "decimals": 8,
            "symbol": "vXVS",
            "underlyingToken": {
              "address": "0x700868CAbb60e90d77B6588ce072d9859ec8E281",
              "asset": "data:image/svg+xml,%3csvg%20width='20'%20height='20'%20viewBox='0%200%2020%2020'%20fill='none'%20xmlns='http://www.w3.org/2000/svg'%3e%3cg%20clip-path='url(%23clip0_1481_22469)'%3e%3ccircle%20cx='10'%20cy='10'%20r='10'%20fill='%23EDEFF0'/%3e%3cpath%20opacity='0.7'%20d='M9.99706%207.91869V2L5.19995%2010.1478L9.99706%2013.051V7.91869Z'%20fill='%239AA2D1'/%3e%3cpath%20opacity='0.8'%20d='M9.99707%2013.051L14.8%2010.1478L9.99707%202V7.91869V13.051Z'%20fill='%237381C6'/%3e%3cpath%20opacity='0.8'%20d='M9.99706%2013.051L14.8%2010.1478L9.99706%207.9187L5.19995%2010.1478L9.99706%2013.051Z'%20fill='%235668B8'/%3e%3cpath%20opacity='0.8'%20d='M9.99706%2013.9793L5.19995%2011.082L9.99706%2018V13.9793Z'%20fill='%2396A5D7'/%3e%3cpath%20opacity='0.8'%20d='M14.8%2011.082L9.99707%2013.9793V18L14.8%2011.082Z'%20fill='%236171BC'/%3e%3c/g%3e%3cdefs%3e%3cclipPath%20id='clip0_1481_22469'%3e%3crect%20width='20'%20height='20'%20fill='white'/%3e%3c/clipPath%3e%3c/defs%3e%3c/svg%3e",
              "decimals": 18,
              "symbol": "WETH",
              "tokenWrapped": {
                "address": "0x98f7A83361F7Ac8765CcEBAB1425da6b341958a7",
                "asset": "data:image/svg+xml,%3csvg%20xmlns='http://www.w3.org/2000/svg'%20width='24'%20height='24'%20fill='none'%20xmlns:v='https://vecta.io/nano'%3e%3cg%20clip-path='url(%23A)'%3e%3ccircle%20cx='12'%20cy='12'%20r='12'%20fill='%23edeff0'/%3e%3cg%20fill='%23000'%3e%3cpath%20opacity='.6'%20d='M11.997%2015.661l5.764-3.484-5.764-2.675-5.757%202.675%205.757%203.484z'/%3e%3cpath%20opacity='.45'%20d='M11.997%209.502V2.4L6.24%2012.177l5.757%203.484V9.502z'/%3e%3cpath%20opacity='.8'%20d='M11.997%2015.661l5.764-3.484L11.997%202.4v7.102%206.159z'/%3e%3cpath%20opacity='.45'%20d='M11.997%2016.775L6.24%2013.299l5.757%208.302v-4.825z'/%3e%3cpath%20opacity='.8'%20d='M17.76%2013.299l-5.764%203.477V21.6l5.764-8.301z'/%3e%3c/g%3e%3c/g%3e%3cdefs%3e%3cclipPath%20id='A'%3e%3cpath%20fill='%23fff'%20d='M0%200h24v24H0z'/%3e%3c/clipPath%3e%3c/defs%3e%3c/svg%3e",
                "decimals": 18,
                "isNative": true,
                "symbol": "ETH",
              },
            },
          },
          "wrap": true,
        },
      ]
    `);

    await waitFor(() => expect(onCloseMock).toHaveBeenCalledTimes(1));
  });
});
