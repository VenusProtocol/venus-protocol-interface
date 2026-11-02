import { fireEvent, waitFor } from '@testing-library/react';
import BigNumber from 'bignumber.js';
import type { Mock } from 'vitest';

import fakeAccountAddress from '__mocks__/models/address';
import { liquidityHubs } from '__mocks__/models/liquidityHubs';
import { renderComponent } from 'testUtils/render';

import {
  useGetLiquidityHubs,
  useGetPool,
  useSupply,
  useSupplyFromWalletToLiquidityHub,
} from 'clients/api';
import { selectToken } from 'components/SelectTokenTextField/__testUtils__/testUtils';
import { getTokenTextFieldTestId } from 'components/SelectTokenTextField/testIdGetters';
import { replaceAssetsInPool } from 'containers/MarketForm/__testUtils__/replaceAssetsInPool';
import { type UseIsFeatureEnabledInput, useIsFeatureEnabled } from 'hooks/useIsFeatureEnabled';
import { useSimulatePoolMutations } from 'hooks/useSimulatePoolMutations';
import useTokenApproval from 'hooks/useTokenApproval';
import { en } from 'libs/translations';
import type { Asset } from 'types';

import Supply from '..';
import { fakeAsset, fakePool } from '../__testUtils__/fakeData';
import TEST_IDS from '../testIds';

const liquidityHub = {
  ...liquidityHubs[0],
  pricePerShare: new BigNumber(2),
  userWalletBalanceTokens: new BigNumber(100),
  supplyCapTokens: new BigNumber(1_000_000),
};
const hubUnderlyingToken = liquidityHub.vhToken.underlyingToken;

const vhAsset: Asset = {
  ...fakeAsset,
  disabledTokenActions: ['swapAndSupply'],
  supplyCapTokens: new BigNumber(1_000_000),
  vToken: {
    ...fakeAsset.vToken,
    underlyingToken: {
      ...liquidityHub.vhToken,
      iconSrc: fakeAsset.vToken.underlyingToken.iconSrc,
    },
  },
};
const pool = replaceAssetsInPool(fakePool, [vhAsset]);

const mockSupply = vi.fn();
const mockSupplyFromWalletToLiquidityHub = vi.fn();

const renderSupplyForm = () =>
  renderComponent(<Supply asset={vhAsset} pool={pool} />, {
    accountAddress: fakeAccountAddress,
  });

describe('SupplyForm - Liquidity Hub underlying option', () => {
  beforeEach(() => {
    mockSupply.mockClear();
    mockSupplyFromWalletToLiquidityHub.mockClear();

    (useIsFeatureEnabled as Mock).mockImplementation(
      ({ name }: UseIsFeatureEnabledInput) => name === 'liquidityHubAutoResupply',
    );
    (useGetPool as Mock).mockImplementation(() => ({
      isLoading: false,
      data: {
        pool,
      },
    }));
    (useGetLiquidityHubs as Mock).mockReturnValue({
      data: {
        liquidityHubs: [liquidityHub],
      },
    });
    (useSupply as Mock).mockReturnValue({ mutateAsync: mockSupply });
    (useSupplyFromWalletToLiquidityHub as Mock).mockReturnValue({
      mutateAsync: mockSupplyFromWalletToLiquidityHub,
    });
  });

  it('does not offer the underlying token when auto-resupply is disabled', () => {
    (useIsFeatureEnabled as Mock).mockReturnValue(false);

    const { queryByTestId } = renderSupplyForm();

    expect(queryByTestId(TEST_IDS.selectTokenTextField)).toBeNull();
  });

  it('lets user supply the underlying token through the Liquidity Hub', async () => {
    const { container, getByTestId, getByText, queryByTestId } = renderSupplyForm();

    await waitFor(() => expect(queryByTestId(TEST_IDS.selectTokenTextField)).toBeVisible());

    selectToken({
      container,
      selectTokenTextFieldTestId: TEST_IDS.selectTokenTextField,
      token: hubUnderlyingToken,
    });

    expect(useTokenApproval).toHaveBeenLastCalledWith({
      token: hubUnderlyingToken,
      spenderAddress: '0xfakeCollateralGatewayContractAddress',
      accountAddress: fakeAccountAddress,
    });

    const input = getByTestId(
      getTokenTextFieldTestId({
        parentTestId: TEST_IDS.selectTokenTextField,
      }),
    ) as HTMLInputElement;

    fireEvent.change(input, { target: { value: '10' } });

    await waitFor(() =>
      expect(useSimulatePoolMutations).toHaveBeenLastCalledWith({
        pool,
        balanceMutations: [
          expect.objectContaining({
            action: 'supply',
            vTokenAddress: vhAsset.vToken.address,
            amountTokens: new BigNumber(5),
            enableAsCollateralOfUser: true,
          }),
        ],
      }),
    );

    const submitButton = await waitFor(() => getByText(en.marketForm.submitButtonLabel.supply));
    await waitFor(() => expect(submitButton).toBeEnabled());
    fireEvent.click(submitButton);

    await waitFor(() =>
      expect(mockSupplyFromWalletToLiquidityHub).toHaveBeenCalledWith({
        liquidityHub,
        vhMarketVToken: vhAsset.vToken,
        amountMantissa: new BigNumber(10).shiftedBy(hubUnderlyingToken.decimals),
      }),
    );
    expect(mockSupply).not.toHaveBeenCalled();
  });

  it('blocks amounts above the Liquidity Hub remaining capacity', async () => {
    (useGetLiquidityHubs as Mock).mockReturnValue({
      data: {
        liquidityHubs: [
          {
            ...liquidityHub,
            supplyCapTokens: new BigNumber(50),
            supplyBalanceTokens: new BigNumber(45),
            userSupplyCapTokens: undefined,
          },
        ],
      },
    });

    const { container, getByTestId, getByText, queryByTestId } = renderSupplyForm();

    await waitFor(() => expect(queryByTestId(TEST_IDS.selectTokenTextField)).toBeVisible());

    selectToken({
      container,
      selectTokenTextFieldTestId: TEST_IDS.selectTokenTextField,
      token: hubUnderlyingToken,
    });

    const input = getByTestId(
      getTokenTextFieldTestId({
        parentTestId: TEST_IDS.selectTokenTextField,
      }),
    ) as HTMLInputElement;

    fireEvent.change(input, { target: { value: '10' } });

    await waitFor(() =>
      expect(getByText(en.marketForm.error.higherThanAvailableAmount)).toBeInTheDocument(),
    );
    expect(mockSupplyFromWalletToLiquidityHub).not.toHaveBeenCalled();
  });

  it('blocks amounts above the Liquidity Hub user supply cap', async () => {
    (useGetLiquidityHubs as Mock).mockReturnValue({
      data: {
        liquidityHubs: [{ ...liquidityHub, userSupplyCapTokens: new BigNumber(3) }],
      },
    });

    const { container, getByTestId, getByText, queryByTestId } = renderSupplyForm();

    await waitFor(() => expect(queryByTestId(TEST_IDS.selectTokenTextField)).toBeVisible());

    selectToken({
      container,
      selectTokenTextFieldTestId: TEST_IDS.selectTokenTextField,
      token: hubUnderlyingToken,
    });

    const input = getByTestId(
      getTokenTextFieldTestId({
        parentTestId: TEST_IDS.selectTokenTextField,
      }),
    ) as HTMLInputElement;

    fireEvent.change(input, { target: { value: '5' } });

    await waitFor(() =>
      expect(getByText(en.marketForm.error.higherThanAvailableAmount)).toBeInTheDocument(),
    );
  });

  it('locks the collateral toggle on when supplying the underlying token', async () => {
    const { container, getByRole, queryByTestId } = renderSupplyForm();

    await waitFor(() => expect(queryByTestId(TEST_IDS.selectTokenTextField)).toBeVisible());

    selectToken({
      container,
      selectTokenTextFieldTestId: TEST_IDS.selectTokenTextField,
      token: hubUnderlyingToken,
    });

    const collateralSwitch = getByRole('checkbox') as HTMLInputElement;

    await waitFor(() => expect(collateralSwitch).toBeChecked());
    expect(collateralSwitch).toBeDisabled();
  });
});
