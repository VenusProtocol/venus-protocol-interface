import fakeAddress from '__mocks__/models/address';
import { poolData } from '__mocks__/models/pools';
import { busd, eth, usdt } from '__mocks__/models/tokens';
import { useGetPool, useGetProportionalCloseTolerancePercentage } from 'clients/api';
import { useChain } from 'hooks/useChain';
import { useAccountAddress } from 'libs/wallet';
import { useGetYieldPlusAssets } from 'pages/YieldPlus/useGetYieldPlusAssets';
import { useTokenPair } from 'pages/YieldPlus/useTokenPair';
import { renderHook } from 'testUtils/render';
import type { Asset, Token } from 'types';
import type { Mock } from 'vitest';

import { useGetNewYieldPlusPosition } from '..';
import { calculateMaxLeverageFactor } from '../../../../calculateMaxLeverageFactor';

vi.mock('hooks/useChain', () => ({
  useChain: vi.fn(),
}));

vi.mock('pages/YieldPlus/useGetYieldPlusAssets', () => ({
  useGetYieldPlusAssets: vi.fn(),
}));

vi.mock('pages/YieldPlus/useTokenPair', () => ({
  useTokenPair: vi.fn(),
}));

vi.mock('../../../../calculateMaxLeverageFactor', () => ({
  calculateMaxLeverageFactor: vi.fn(),
}));

const pool = poolData[0];
const dsaAsset = pool.assets[0];
const longAsset = pool.assets[2];

const setHookState = (
  input: {
    accountAddress?: string;
    corePoolComptrollerContractAddress?: string;
    longToken?: Token;
    shortToken?: Token;
    dsaAssets?: Asset[];
    isGetYieldPlusAssetsLoading?: boolean;
    getPoolData?:
      | {
          pool: typeof pool;
        }
      | undefined;
    isGetPoolLoading?: boolean;
    proportionalCloseTolerancePercentage?: number | undefined;
    maximumLeverageFactor?: number;
  } = {},
) => {
  const {
    accountAddress = fakeAddress,
    corePoolComptrollerContractAddress = pool.comptrollerAddress,
    longToken = usdt,
    shortToken = busd,
    dsaAssets = [dsaAsset],
    isGetYieldPlusAssetsLoading = false,
    isGetPoolLoading = false,
    maximumLeverageFactor = 3,
  } = input;

  const getPoolData =
    'getPoolData' in input
      ? input.getPoolData
      : {
          pool,
        };

  const proportionalCloseTolerancePercentage =
    'proportionalCloseTolerancePercentage' in input
      ? input.proportionalCloseTolerancePercentage
      : 2;

  (useAccountAddress as Mock).mockImplementation(() => ({
    accountAddress,
  }));

  (useChain as Mock).mockImplementation(() => ({
    corePoolComptrollerContractAddress,
  }));

  (useTokenPair as Mock).mockImplementation(() => ({
    longToken,
    shortToken,
  }));

  (useGetYieldPlusAssets as Mock).mockImplementation(() => ({
    data: {
      dsaAssets,
    },
    isLoading: isGetYieldPlusAssetsLoading,
  }));

  (useGetProportionalCloseTolerancePercentage as Mock).mockImplementation(() => ({
    data:
      typeof proportionalCloseTolerancePercentage === 'number'
        ? {
            proportionalCloseTolerancePercentage,
          }
        : undefined,
  }));

  (useGetPool as Mock).mockImplementation(() => ({
    data: getPoolData,
    isLoading: isGetPoolLoading,
  }));

  (calculateMaxLeverageFactor as Mock).mockReturnValue(maximumLeverageFactor);
};

describe('useGetNewYieldPlusPosition', () => {
  beforeEach(() => {
    setHookState();
  });

  it('passes the connected wallet address and core pool address to downstream hooks', () => {
    renderHook(() => useGetNewYieldPlusPosition(), {
      accountAddress: fakeAddress,
    });

    expect(useGetYieldPlusAssets).toHaveBeenCalledWith({
      accountAddress: fakeAddress,
    });

    expect(useGetPool).toHaveBeenCalledWith({
      poolComptrollerAddress: pool.comptrollerAddress,
      accountAddress: fakeAddress,
    });
  });

  it('returns a loading state while the core pool query is loading', () => {
    setHookState({
      getPoolData: undefined,
      isGetPoolLoading: true,
    });

    const { result } = renderHook(() => useGetNewYieldPlusPosition());

    expect(result.current).toEqual({
      data: {
        position: undefined,
      },
      isLoading: true,
    });
  });

  it('returns a loading state while Yield Plus assets are loading', () => {
    setHookState({
      isGetYieldPlusAssetsLoading: true,
    });

    const { result } = renderHook(() => useGetNewYieldPlusPosition());

    expect(result.current.isLoading).toBe(true);
  });

  it('returns an undefined position when no DSA asset is available', () => {
    setHookState({
      dsaAssets: [],
    });

    const { result } = renderHook(() => useGetNewYieldPlusPosition());

    expect(result.current.data).toEqual({
      position: undefined,
    });
    expect(calculateMaxLeverageFactor).not.toHaveBeenCalled();
  });

  it('returns an undefined position when the selected token pair is not available in the pool', () => {
    setHookState({
      longToken: eth,
    });

    const { result } = renderHook(() => useGetNewYieldPlusPosition());

    expect(result.current.data).toEqual({
      position: undefined,
    });
    expect(calculateMaxLeverageFactor).not.toHaveBeenCalled();
  });

  it('returns an undefined position when the close tolerance is unavailable', () => {
    setHookState({
      proportionalCloseTolerancePercentage: undefined,
    });

    const { result } = renderHook(() => useGetNewYieldPlusPosition());

    expect(result.current.data).toEqual({
      position: undefined,
    });
    expect(calculateMaxLeverageFactor).not.toHaveBeenCalled();
  });

  it('passes the selected DSA and long asset collateral factors to calculateMaxLeverageFactor', () => {
    renderHook(() => useGetNewYieldPlusPosition());

    expect(calculateMaxLeverageFactor).toHaveBeenCalledWith({
      dsaTokenCollateralFactor: dsaAsset.userCollateralFactor,
      longTokenCollateralFactor: longAsset.userCollateralFactor,
      proportionalCloseTolerancePercentage: 2,
    });
  });

  it('returns a new base position built from the core pool with user balances reset', () => {
    const { result } = renderHook(() => useGetNewYieldPlusPosition());

    expect(result.current.data.position).toMatchSnapshot();
  });

  it('caps the leverage factor to the default value of 2', () => {
    setHookState({
      maximumLeverageFactor: 4,
    });

    const { result } = renderHook(() => useGetNewYieldPlusPosition());

    expect(result.current.data.position?.leverageFactor).toBe(2);
  });

  it('uses the computed maximum leverage factor when it is below the default', () => {
    setHookState({
      maximumLeverageFactor: 1.5,
    });

    const { result } = renderHook(() => useGetNewYieldPlusPosition());

    expect(result.current.data.position?.leverageFactor).toBe(1.5);
  });
});
