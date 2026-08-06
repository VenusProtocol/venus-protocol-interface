import { renderHook } from '@testing-library/react';
import BigNumber from 'bignumber.js';
import type { Address } from 'viem';
import type { Mock } from 'vitest';

import fakeAccountAddress from '__mocks__/models/address';
import { vUsdtCorePool } from '__mocks__/models/vTokens';
import { useGetHypotheticalPrimeApys } from 'clients/api/queries/getHypotheticalPrimeApys/useGetHypotheticalPrimeApys';
import { useGetPrimeDistributionForMarket } from 'clients/api/queries/getPrimeDistributionForMarket/useGetPrimeDistributionForMarket';
import { NULL_ADDRESS } from 'constants/address';
import { useGetPrimeEstimation } from '..';

vi.mock('clients/api/queries/getHypotheticalPrimeApys/useGetHypotheticalPrimeApys', () => ({
  useGetHypotheticalPrimeApys: vi.fn(),
}));

vi.mock(
  'clients/api/queries/getPrimeDistributionForMarket/useGetPrimeDistributionForMarket',
  () => ({
    useGetPrimeDistributionForMarket: vi.fn(),
  }),
);

const suppliedAmountMantissa = new BigNumber('2000000');
const borrowedAmountMantissa = new BigNumber('1500000');
const stakedAmountXvsMantissa = new BigNumber('100000000000000000000');

const baseInput = {
  accountAddress: fakeAccountAddress as Address,
  suppliedAmountMantissa,
  borrowedAmountMantissa,
  stakedAmountXvsMantissa,
  vToken: vUsdtCorePool,
};

const mockCompleteChildQueryData = () => {
  (useGetPrimeDistributionForMarket as Mock).mockReturnValue({
    data: {
      totalDistributedMantissa: new BigNumber('365000000'),
    },
  });

  (useGetHypotheticalPrimeApys as Mock).mockReturnValue({
    data: {
      supplyApyPercentage: new BigNumber('12.34'),
      borrowApyPercentage: new BigNumber('5.67'),
      supplyCapMantissa: new BigNumber('10000000'),
      borrowCapMantissa: new BigNumber('8000000'),
      supplyCapCents: new BigNumber('100000'),
      borrowCapCents: new BigNumber('80000'),
      userPrimeRewardsShare: new BigNumber('0.2'),
    },
  });
};

const expectBigNumber = (value: BigNumber | undefined, expected: string) => {
  expect(value?.toString()).toBe(expected);
};

describe('useGetPrimeEstimation', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockCompleteChildQueryData();
  });

  it('passes the expected params to child hooks', () => {
    renderHook(() => useGetPrimeEstimation(baseInput, { enabled: true }));

    expect(useGetPrimeDistributionForMarket).toHaveBeenCalledWith(
      {
        vTokenAddress: vUsdtCorePool.address,
      },
      {
        enabled: true,
      },
    );
    expect(useGetHypotheticalPrimeApys).toHaveBeenCalledWith(
      {
        vTokenAddress: vUsdtCorePool.address,
        userSupplyBalanceMantissa: suppliedAmountMantissa,
        userBorrowBalanceMantissa: borrowedAmountMantissa,
        userXvsStakedMantissa: stakedAmountXvsMantissa,
        accountAddress: fakeAccountAddress,
      },
      {
        enabled: true,
      },
    );
  });

  it('uses NULL_ADDRESS when the account address is missing', () => {
    renderHook(() =>
      useGetPrimeEstimation(
        {
          ...baseInput,
          accountAddress: undefined,
        },
        { enabled: true },
      ),
    );

    expect(useGetHypotheticalPrimeApys).toHaveBeenCalledWith(
      expect.objectContaining({
        accountAddress: NULL_ADDRESS,
      }),
      expect.any(Object),
    );
  });

  it('returns all computed estimation fields when child query data is complete', () => {
    const { result } = renderHook(() => useGetPrimeEstimation(baseInput, { enabled: true }));

    expectBigNumber(result.current.data.suppliedTokens, '2');
    expectBigNumber(result.current.data.borrowedTokens, '1.5');
    expectBigNumber(result.current.data.supplyCapTokens, '10');
    expectBigNumber(result.current.data.borrowCapTokens, '8');
    expectBigNumber(result.current.data.dailyTokensDistributedAmount, '1');
    expectBigNumber(result.current.data.userDailyPrimeRewards, '0.2');
    expectBigNumber(result.current.data.supplyApyPercentage, '12.34');
    expectBigNumber(result.current.data.borrowApyPercentage, '5.67');
    expectBigNumber(result.current.data.supplyCapCents, '100000');
    expectBigNumber(result.current.data.borrowCapCents, '80000');
  });

  it('returns undefined fields when required data is incomplete', () => {
    (useGetPrimeDistributionForMarket as Mock).mockReturnValue({
      data: undefined,
    });

    const { result } = renderHook(() => useGetPrimeEstimation(baseInput, { enabled: true }));

    expect(result.current.data).toEqual({
      dailyTokensDistributedAmount: undefined,
      borrowedTokens: undefined,
      borrowApyPercentage: undefined,
      borrowCapTokens: undefined,
      borrowCapCents: undefined,
      suppliedTokens: undefined,
      supplyApyPercentage: undefined,
      supplyCapTokens: undefined,
      supplyCapCents: undefined,
      userDailyPrimeRewards: undefined,
    });
  });

  it('disables child queries when options are disabled or vToken is missing', () => {
    renderHook(() => useGetPrimeEstimation(baseInput, { enabled: false }));

    expect(useGetPrimeDistributionForMarket).toHaveBeenLastCalledWith(expect.any(Object), {
      enabled: false,
    });
    expect(useGetHypotheticalPrimeApys).toHaveBeenLastCalledWith(expect.any(Object), {
      enabled: false,
    });

    vi.clearAllMocks();

    renderHook(() =>
      useGetPrimeEstimation(
        {
          ...baseInput,
          vToken: undefined,
        },
        { enabled: true },
      ),
    );

    expect(useGetPrimeDistributionForMarket).toHaveBeenCalledWith(
      {
        vTokenAddress: NULL_ADDRESS,
      },
      {
        enabled: false,
      },
    );
    expect(useGetHypotheticalPrimeApys).toHaveBeenCalledWith(
      expect.objectContaining({
        vTokenAddress: NULL_ADDRESS,
      }),
      {
        enabled: false,
      },
    );
  });
});
