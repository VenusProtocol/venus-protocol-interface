import { fireEvent, waitFor } from '@testing-library/react';
import BigNumber from 'bignumber.js';
import noop from 'noop-ts';
import type Vi from 'vitest';

import fakeAccountAddress from '__mocks__/models/address';
import { eth } from '__mocks__/models/tokens';
import { renderComponent } from 'testUtils/render';

import { supply, useGetBalanceOf } from 'clients/api';
import { selectToken } from 'components/SelectTokenTextField/__testUtils__/testUtils';
import { getTokenTextFieldTestId } from 'components/SelectTokenTextField/testIdGetters';
import { type UseIsFeatureEnabled, useIsFeatureEnabled } from 'hooks/useIsFeatureEnabled';
import { en } from 'libs/translations';
import { type Asset, ChainId } from 'types';
import { convertTokensToMantissa } from 'utilities';

import Supply from '..';
import { fakeAsset, fakePool, fakeWethAsset } from '../__testUtils__/fakeData';
import TEST_IDS from '../testIds';

vi.mock('libs/tokens');
vi.mock('hooks/useGetNativeWrappedTokenUserBalances');

const fakeNativeTokenBalanceTokens = new BigNumber(10);
const fakeBalanceMantissa = fakeNativeTokenBalanceTokens.multipliedBy(10 ** 18);

describe('SupplyForm - Feature flag enabled: wrapUnwrapNativeToken', () => {
  beforeEach(() => {
    (useIsFeatureEnabled as Vi.Mock).mockImplementation(
      ({ name }: UseIsFeatureEnabled) => name === 'wrapUnwrapNativeToken',
    );
    (useGetBalanceOf as Vi.Mock).mockImplementation(() => ({
      data: {
        balanceMantissa: fakeBalanceMantissa,
      },
      isLoading: false,
    }));
  });

  it('renders without crashing', () => {
    renderComponent(<Supply asset={fakeAsset} pool={fakePool} onCloseModal={noop} />, {
      chainId: ChainId.SEPOLIA,
    });
  });

  it('does not display the token selector if the underlying token does not wrap the chain native token', async () => {
    const { queryByTestId } = renderComponent(
      <Supply asset={fakeAsset} pool={fakePool} onCloseModal={noop} />,
      {
        chainId: ChainId.SEPOLIA,
        accountAddress: fakeAccountAddress,
      },
    );

    expect(queryByTestId(TEST_IDS.selectTokenTextField)).toBeNull();
  });

  it('displays the token selector if the underlying token wraps the chain native token', async () => {
    const { queryByTestId } = renderComponent(
      <Supply asset={fakeWethAsset} pool={fakePool} onCloseModal={noop} />,
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
      supplyCapTokens: undefined,
    };

    const { container, getByTestId, queryByTestId, getByText } = renderComponent(
      <Supply asset={customFakeAsset} pool={fakePool} onCloseModal={noop} />,
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

    await waitFor(() => getByText(en.operationModal.supply.submitButtonLabel.enterValidAmount));

    // Click on MAX button
    fireEvent.click(getByText(en.operationModal.supply.rightMaxButtonLabel));

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
    expect(
      getByText(en.operationModal.supply.submitButtonLabel.supply).closest('button'),
    ).toBeEnabled();
  });

  it('lets user wrap and supply, then calls onClose callback on success', async () => {
    const amountTokensToSupply = new BigNumber('1');
    const amountMantissaToSupply = convertTokensToMantissa({
      value: amountTokensToSupply,
      token: eth,
    });

    const onCloseMock = vi.fn();
    const { container, getByTestId, queryByTestId, getByText } = renderComponent(
      <Supply asset={fakeWethAsset} pool={fakePool} onCloseModal={onCloseMock} />,
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

    const expectedSubmitButtonLabel = en.operationModal.supply.submitButtonLabel.supply;

    // Click on submit button
    const submitButton = await waitFor(() => getByText(expectedSubmitButtonLabel));
    expect(submitButton).toBeEnabled();
    fireEvent.click(submitButton);

    await waitFor(() => expect(supply).toHaveBeenCalledTimes(1));
    expect(supply).toHaveBeenCalledWith({
      accountAddress: fakeAccountAddress,
      amountMantissa: amountMantissaToSupply,
      wrap: true,
      poolComptrollerContractAddress: fakePool.comptrollerAddress,
    });

    await waitFor(() => expect(onCloseMock).toHaveBeenCalledTimes(1));
  });
});
