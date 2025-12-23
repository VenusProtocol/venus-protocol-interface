import { fireEvent, waitFor } from '@testing-library/react';
import BigNumber from 'bignumber.js';
import type { Mock } from 'vitest';

import fakeAccountAddress from '__mocks__/models/address';
import { eth } from '__mocks__/models/tokens';
import { renderComponent } from 'testUtils/render';

import { useGetBalanceOf, useSupply } from 'clients/api';
import { selectToken } from 'components/SelectTokenTextField/__testUtils__/testUtils';
import { getTokenTextFieldTestId } from 'components/SelectTokenTextField/testIdGetters';
import { type UseIsFeatureEnabledInput, useIsFeatureEnabled } from 'hooks/useIsFeatureEnabled';
import { en } from 'libs/translations';
import { type Asset, type AssetBalanceMutation, ChainId } from 'types';

import MAX_UINT256 from 'constants/maxUint256';
import { useSimulateBalanceMutations } from 'hooks/useSimulateBalanceMutations';
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

  it('does not display the token selector if the underlying token does not wrap the chain native token', async () => {
    const { queryByTestId } = renderComponent(
      <Supply
        asset={fakeAsset}
        pool={fakePool}
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

  it('lets user wrap and supply', async () => {
    const amountTokensToSupply = new BigNumber('1');

    const { container, getByTestId, queryByTestId, getByText } = renderComponent(
      <Supply
        asset={fakeWethAsset}
        pool={fakePool}
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

    // Check generated balance mutations are accurate
    const expectedBalanceMutations: AssetBalanceMutation[] = [
      {
        type: 'asset',
        action: 'supply',
        vTokenAddress: fakeAsset.vToken.address,
        amountTokens: amountTokensToSupply,
      },
    ];

    expect(useSimulateBalanceMutations).toHaveBeenCalledWith({
      pool: fakePool,
      balanceMutations: expectedBalanceMutations,
    });

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
              "decimals": 18,
              "iconSrc": "fake-weth-asset",
              "symbol": "WETH",
              "tokenWrapped": {
                "address": "0x98f7A83361F7Ac8765CcEBAB1425da6b341958a7",
                "decimals": 18,
                "iconSrc": "fake-eth-asset",
                "isNative": true,
                "symbol": "ETH",
              },
            },
          },
          "wrap": true,
        },
      ]
    `);
  });
});
