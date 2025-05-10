import type { Mock } from 'vitest';

import fakeAccountAddress from '__mocks__/models/address';
import { assetData } from '__mocks__/models/asset';
import BigNumber from 'bignumber.js';
import {
  useGetHypotheticalPrimeApys,
  useGetPrimeStatus,
  useGetXvsVaultUserInfo,
} from 'clients/api';
import { renderHook } from 'testUtils/render';
import type { TokenAction } from 'types';
import { useGetHypotheticalUserPrimeApys } from '..';

const fakeAsset = assetData[0];
const fakeAssetWithPrimeDistribution = assetData[1];

describe('useGetHypotheticalUserPrimeApys', () => {
  beforeEach(() => {
    (useGetPrimeStatus as Mock).mockImplementation(() => ({
      data: {
        xvsVaultPoolId: 1,
      },
    }));

    (useGetXvsVaultUserInfo as Mock).mockImplementation(() => ({
      data: {
        stakedAmountMantissa: new BigNumber('1000000000000000'),
      },
    }));

    (useGetHypotheticalPrimeApys as Mock).mockImplementation(() => ({
      data: {
        supplyApyPercentage: new BigNumber(13.4),
        borrowApyPercentage: new BigNumber(10.4),
      },
    }));
  });

  it('returns undefined when user is disconnected', async () => {
    const { result } = renderHook(() =>
      useGetHypotheticalUserPrimeApys({
        asset: fakeAssetWithPrimeDistribution,
        action: 'supply',
        toTokenAmountTokens: new BigNumber(10),
      }),
    );

    expect(result.current).toMatchSnapshot();
  });

  it('returns undefined when connected user does not hold a Prime token', async () => {
    const { result } = renderHook(
      () =>
        useGetHypotheticalUserPrimeApys({
          asset: fakeAsset, // The hook detects that a user is not Prime by the fact the asset contains no distribution of the type "prime"
          action: 'supply',
          toTokenAmountTokens: new BigNumber(10),
        }),
      {
        accountAddress: fakeAccountAddress,
      },
    );

    expect(result.current).toMatchSnapshot();
  });

  it('returns undefined when passed toTokenAmountTokens parameter equals 0', async () => {
    const { result } = renderHook(
      () =>
        useGetHypotheticalUserPrimeApys({
          asset: fakeAssetWithPrimeDistribution,
          action: 'supply',
          toTokenAmountTokens: new BigNumber(0),
        }),
      {
        accountAddress: fakeAccountAddress,
      },
    );

    expect(result.current).toMatchSnapshot();
  });

  it.each([
    { action: 'supply', amountTokens: 0 },
    { action: 'supply', amountTokens: 50 },
    { action: 'swapAndSupply', amountTokens: 0 },
    { action: 'swapAndSupply', amountTokens: 50 },
    { action: 'withdraw', amountTokens: 0 },
    { action: 'withdraw', amountTokens: 50 },
    { action: 'borrow', amountTokens: 0 },
    { action: 'borrow', amountTokens: 50 },
    { action: 'repay', amountTokens: 0 },
    { action: 'repay', amountTokens: 50 },
  ] as { action: TokenAction; amountTokens: number }[])(
    'returns correct values: %s',
    async ({ action, amountTokens }) => {
      const { result } = renderHook(
        () =>
          useGetHypotheticalUserPrimeApys({
            asset: fakeAssetWithPrimeDistribution,
            action,
            toTokenAmountTokens: new BigNumber(amountTokens),
          }),
        {
          accountAddress: fakeAccountAddress,
        },
      );

      expect((useGetHypotheticalPrimeApys as Mock).mock.calls[0]).toMatchSnapshot();

      expect(result.current).toMatchSnapshot();
    },
  );
});
