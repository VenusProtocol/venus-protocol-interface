import BigNumber from 'bignumber.js';
import { useMemo } from 'react';
import { QueryObserverOptions } from 'react-query';

import {
  GetHypotheticalPrimeApysOutput,
  useGetHypotheticalPrimeApys,
  useGetPrimeDistributionForMarket,
} from 'clients/api';
import { NULL_ADDRESS } from 'constants/address';
import FunctionKey from 'constants/functionKey';
import { useGetToken } from 'packages/tokens';
import { VToken } from 'types';
import {
  convertMantissaToTokens,
  convertPriceMantissaToDollars,
  convertTokensToMantissa,
} from 'utilities';

interface UseGetPrimeEstimationInput {
  accountAddress?: string;
  suppliedAmountTokens: string;
  borrowedAmountTokens: string;
  stakedAmountXvsTokens: string;
  vToken: VToken | undefined;
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
    borrowedAmountTokens,
    stakedAmountXvsTokens,
    suppliedAmountTokens,
    vToken,
  }: UseGetPrimeEstimationInput,
  options?: Options,
) => {
  const xvs = useGetToken({
    symbol: 'XVS',
  });

  const noEmptyValues = !!borrowedAmountTokens && !!stakedAmountXvsTokens && !!suppliedAmountTokens;
  const enabled = !!options?.enabled && noEmptyValues && !!vToken;

  const { data: primeDistributionForMarketData } = useGetPrimeDistributionForMarket(
    {
      vTokenAddress: vToken?.address || '',
    },
    {
      enabled: !!vToken,
    },
  );

  const primeTokensDistributedAmount = convertMantissaToTokens({
    value: primeDistributionForMarketData?.totalDistributedMantissa || new BigNumber(0),
    token: vToken?.underlyingToken,
  });

  const { userSupplyBalanceMantissa, userBorrowBalanceMantissa, userXvsStakedMantissa } =
    useMemo(() => {
      const userSupplyBalance = vToken
        ? convertTokensToMantissa({
            value: new BigNumber(suppliedAmountTokens),
            token: vToken.underlyingToken,
          })
        : new BigNumber(0);
      const userBorrowBalance = vToken
        ? convertTokensToMantissa({
            value: new BigNumber(borrowedAmountTokens),
            token: vToken.underlyingToken,
          })
        : new BigNumber(0);
      const userXvsStaked = xvs
        ? convertTokensToMantissa({
            value: new BigNumber(stakedAmountXvsTokens),
            token: xvs,
          })
        : BigNumber(0);

      return {
        userSupplyBalanceMantissa: userSupplyBalance,
        userBorrowBalanceMantissa: userBorrowBalance,
        userXvsStakedMantissa: userXvsStaked,
      };
    }, [suppliedAmountTokens, borrowedAmountTokens, stakedAmountXvsTokens, vToken, xvs]);

  const { data: hypotheticalPrimeApysData } = useGetHypotheticalPrimeApys(
    {
      vTokenAddress: vToken?.address || '',
      userSupplyBalanceMantissa,
      userBorrowBalanceMantissa,
      userXvsStakedMantissa,
      accountAddress: accountAddress || NULL_ADDRESS,
    },
    {
      enabled,
    },
  );

  const estimation = useMemo(() => {
    let primeEstimation = {
      tokensDistributedAmount: '-',
      borrowedTokens: '-',
      borrowApyPercentage: '-',
      borrowCapTokens: new BigNumber(0),
      borrowCapUsd: '-',
      suppliedTokens: '-',
      supplyApyPercentage: '-',
      supplyCapTokens: new BigNumber(0),
      supplyCapUsd: '-',
      userYearlyPrimeRewards: '-',
    };

    if (hypotheticalPrimeApysData && vToken && xvs) {
      const {
        borrowApyPercentage,
        borrowCapMantissa,
        borrowCapUsd: borrowCapPriceMantissa,
        supplyApyPercentage,
        supplyCapMantissa,
        supplyCapUsd: supplyCapPriceMantissa,
        userPrimeRewardsShare,
      } = hypotheticalPrimeApysData;

      const supplyCapUsd = convertPriceMantissaToDollars({
        priceMantissa: supplyCapPriceMantissa,
        token: xvs,
      });

      const borrowCapUsd = convertPriceMantissaToDollars({
        priceMantissa: borrowCapPriceMantissa,
        token: xvs,
      });

      const borrowCapTokens = convertMantissaToTokens({
        value: new BigNumber(borrowCapMantissa.toString()),
        token: vToken.underlyingToken,
      });

      const supplyCapTokens = convertMantissaToTokens({
        value: new BigNumber(supplyCapMantissa.toString()),
        token: vToken.underlyingToken,
      });

      const userYearlyPrimeRewards =
        primeTokensDistributedAmount.multipliedBy(userPrimeRewardsShare);

      primeEstimation = {
        tokensDistributedAmount: primeTokensDistributedAmount.toString(),
        userYearlyPrimeRewards: userYearlyPrimeRewards.toString(),
        borrowedTokens: borrowedAmountTokens,
        borrowApyPercentage: borrowApyPercentage.toFixed(2),
        borrowCapTokens,
        borrowCapUsd: borrowCapUsd.toFixed(2),
        suppliedTokens: suppliedAmountTokens,
        supplyApyPercentage: supplyApyPercentage.toFixed(2),
        supplyCapTokens,
        supplyCapUsd: supplyCapUsd.toFixed(2),
      };
    }

    return primeEstimation;
  }, [
    accountAddress,
    borrowedAmountTokens,
    suppliedAmountTokens,
    primeTokensDistributedAmount,
    vToken,
    xvs,
    enabled,
    hypotheticalPrimeApysData,
  ]);

  return {
    data: estimation,
  };
};

export default useGetPrimeEstimation;
