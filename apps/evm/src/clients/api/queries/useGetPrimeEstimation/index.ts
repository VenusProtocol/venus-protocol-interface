import type { QueryObserverOptions } from '@tanstack/react-query';
import BigNumber from 'bignumber.js';
import { useMemo } from 'react';

import {
  type GetHypotheticalPrimeApysOutput,
  useGetHypotheticalPrimeApys,
  useGetPrimeDistributionForMarket,
} from 'clients/api';
import { NULL_ADDRESS } from 'constants/address';
import type FunctionKey from 'constants/functionKey';
import { DAYS_PER_YEAR } from 'constants/time';
import { useGetToken } from 'libs/tokens';
import type { VToken } from 'types';
import { convertMantissaToTokens } from 'utilities';
import type { Address } from 'viem';

interface UseGetPrimeEstimationInput {
  accountAddress?: Address;
  suppliedAmountMantissa: BigNumber;
  borrowedAmountMantissa: BigNumber;
  stakedAmountXvsMantissa: BigNumber;
  vToken: VToken | undefined;
}

interface UseGetPrimeEstimationOutput {
  dailyTokensDistributedAmount: BigNumber | undefined;
  borrowedTokens: BigNumber | undefined;
  borrowApyPercentage: BigNumber | undefined;
  borrowCapTokens: BigNumber | undefined;
  borrowCapCents: BigNumber | undefined;
  suppliedTokens: BigNumber | undefined;
  supplyApyPercentage: BigNumber | undefined;
  supplyCapTokens: BigNumber | undefined;
  supplyCapCents: BigNumber | undefined;
  userDailyPrimeRewards: BigNumber | undefined;
}

export type UseGetPrimeEstimationQueryKey = [
  FunctionKey.GET_PRIME_ESTIMATION,
  UseGetPrimeEstimationInput,
];

type Options = QueryObserverOptions<
  GetHypotheticalPrimeApysOutput,
  Error,
  GetHypotheticalPrimeApysOutput,
  GetHypotheticalPrimeApysOutput,
  UseGetPrimeEstimationQueryKey
>;

const useGetPrimeEstimation = (
  {
    accountAddress,
    borrowedAmountMantissa,
    stakedAmountXvsMantissa,
    suppliedAmountMantissa,
    vToken,
  }: UseGetPrimeEstimationInput,
  options?: Partial<Options>,
) => {
  const xvs = useGetToken({
    symbol: 'XVS',
  });

  const enabled = !!options?.enabled && !!vToken;

  const { data: primeDistributionForMarketData } = useGetPrimeDistributionForMarket(
    {
      vTokenAddress: vToken?.address || NULL_ADDRESS,
    },
    {
      enabled,
    },
  );

  const { data: hypotheticalPrimeApysData } = useGetHypotheticalPrimeApys(
    {
      vTokenAddress: vToken?.address || NULL_ADDRESS,
      userSupplyBalanceMantissa: suppliedAmountMantissa,
      userBorrowBalanceMantissa: borrowedAmountMantissa,
      userXvsStakedMantissa: stakedAmountXvsMantissa,
      accountAddress: accountAddress || NULL_ADDRESS,
    },
    {
      enabled,
    },
  );

  const estimation = useMemo(() => {
    let primeEstimation: UseGetPrimeEstimationOutput = {
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
    };

    if (hypotheticalPrimeApysData && primeDistributionForMarketData && vToken && xvs) {
      const {
        borrowApyPercentage,
        borrowCapMantissa,
        borrowCapCents,
        supplyApyPercentage,
        supplyCapMantissa,
        supplyCapCents,
        userPrimeRewardsShare,
      } = hypotheticalPrimeApysData;

      const borrowedTokens = convertMantissaToTokens({
        value: borrowedAmountMantissa,
        token: vToken.underlyingToken,
      });

      const suppliedTokens = convertMantissaToTokens({
        value: suppliedAmountMantissa,
        token: vToken.underlyingToken,
      });

      const borrowCapTokens = convertMantissaToTokens({
        value: new BigNumber(borrowCapMantissa.toString()),
        token: vToken.underlyingToken,
      });

      const supplyCapTokens = convertMantissaToTokens({
        value: new BigNumber(supplyCapMantissa.toString()),
        token: vToken.underlyingToken,
      });

      const primeTokensDistributedAmount = convertMantissaToTokens({
        value: primeDistributionForMarketData.totalDistributedMantissa,
        token: vToken.underlyingToken,
      });

      const dailyTokensDistributedAmount = primeTokensDistributedAmount.dividedBy(DAYS_PER_YEAR);

      const userDailyPrimeRewards = primeTokensDistributedAmount
        .multipliedBy(userPrimeRewardsShare)
        .dividedBy(DAYS_PER_YEAR);

      primeEstimation = {
        dailyTokensDistributedAmount,
        userDailyPrimeRewards,
        borrowedTokens,
        borrowApyPercentage,
        borrowCapTokens,
        borrowCapCents,
        suppliedTokens,
        supplyApyPercentage,
        supplyCapTokens,
        supplyCapCents,
      };
    }

    return primeEstimation;
  }, [
    borrowedAmountMantissa,
    suppliedAmountMantissa,
    primeDistributionForMarketData,
    vToken,
    xvs,
    hypotheticalPrimeApysData,
  ]);

  return {
    data: estimation,
  };
};

export default useGetPrimeEstimation;
