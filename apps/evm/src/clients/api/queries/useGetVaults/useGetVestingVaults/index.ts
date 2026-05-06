import type { UseQueryResult } from '@tanstack/react-query';
import { useMemo } from 'react';

import {
  type GetXvsVaultPendingWithdrawalsBalanceOutput,
  type GetXvsVaultPoolInfoOutput,
  type GetXvsVaultUserInfoOutput,
  type GetXvsVaultUserPendingWithdrawalsFromBeforeUpgradeOutput,
  useGetTokenListUsdPrice,
  useGetXvsVaultPaused,
  useGetXvsVaultPoolCount,
  useGetXvsVaultTotalAllocationPoints,
  useGetXvsVaultsTotalDailyDistributedXvs,
} from 'clients/api';
import { DAYS_PER_YEAR } from 'constants/time';
import { useGetToken, useGetTokens } from 'libs/tokens';
import type { VenusVault } from 'types';
import { convertDollarsToCents, convertTokensToMantissa, indexBy } from 'utilities';
import findTokenByAddress from 'utilities/findTokenByAddress';

import BigNumber from 'bignumber.js';
import { useChainId } from 'libs/wallet';
import { checkIsXvsOnZk } from 'utilities/xvsPriceOnZk';
import { XVS_FIXED_PRICE_CENTS } from 'utilities/xvsPriceOnZk/constants';
import type { Address } from 'viem';
import { calculateVaultCentsValues } from '../calculateVaultCentsValues';
import { formatToVenusVault } from '../formatToVenusVault';
import { useGetXvsVaultPoolBalances } from './useGetXvsVaultPoolBalances';
import { useGetXvsVaultPools } from './useGetXvsVaultPools';

export interface UseGetVestingVaultsOutput {
  isLoading: boolean;
  data: VenusVault[];
}

export const useGetVestingVaults = (input?: {
  accountAddress?: Address;
}): UseGetVestingVaultsOutput => {
  const { chainId } = useChainId();

  const xvs = useGetToken({
    symbol: 'XVS',
  });
  const tokens = useGetTokens();

  const {
    data: xvsVaultPoolCountData = { poolCount: 0 },
    isLoading: isGetXvsVaultPoolCountLoading,
  } = useGetXvsVaultPoolCount();

  // Fetch data generic to all XVS pools
  const {
    data: xvsVaultDailyDistributedXvsData,
    isLoading: isGetXvsVaultsTotalDailyDistributedXvsLoading,
  } = useGetXvsVaultsTotalDailyDistributedXvs(
    {
      stakedToken: xvs!, // We ensure XVS exists through the enabled option
    },
    {
      enabled: !!xvs,
    },
  );

  const {
    data: xvsVaultTotalAllocationPointsData,
    isLoading: isGetXvsVaultTotalAllocationPointsLoading,
  } = useGetXvsVaultTotalAllocationPoints(
    {
      tokenAddress: xvs!.address, // We ensure XVS exists through the enabled option
    },
    {
      enabled: !!xvs,
    },
  );

  const { data: getXvsVaultPausedData, isLoading: isGetXvsVaultPausedLoading } =
    useGetXvsVaultPaused();

  // Fetch pools
  const poolQueryResults = useGetXvsVaultPools({
    accountAddress: input?.accountAddress,
    poolsCount: xvsVaultPoolCountData.poolCount,
  });
  const arePoolQueriesLoading = poolQueryResults.some(queryResult => queryResult.isLoading);

  // Index results by pool ID
  const [poolData, stakedTokenAddresses] = useMemo(() => {
    const data: {
      [poolIndex: string]: {
        poolInfos: GetXvsVaultPoolInfoOutput;
        pendingWithdrawalsBalanceMantissa: BigNumber;
        userHasPendingWithdrawalsFromBeforeUpgrade: boolean;
        userInfos?: GetXvsVaultUserInfoOutput;
      };
    } = {};

    const tokenAddresses: string[] = [];

    const queriesPerPoolCount =
      xvsVaultPoolCountData.poolCount > 0
        ? poolQueryResults.length / xvsVaultPoolCountData.poolCount
        : 0;

    for (let poolIndex = 0; poolIndex < xvsVaultPoolCountData.poolCount; poolIndex++) {
      const poolQueryResultStartIndex = poolIndex * queriesPerPoolCount;

      const poolInfosQueryResult = poolQueryResults[
        poolQueryResultStartIndex
      ] as UseQueryResult<GetXvsVaultPoolInfoOutput>;

      const poolPendingWithdrawalsBalanceQueryResult = poolQueryResults[
        poolQueryResultStartIndex + 1
      ] as UseQueryResult<GetXvsVaultPendingWithdrawalsBalanceOutput>;

      const userInfoQueryResult = poolQueryResults[
        poolQueryResultStartIndex + 2
      ] as UseQueryResult<GetXvsVaultUserInfoOutput>;

      const userPendingWithdrawalsFromBeforeUpgradeQueryResult = poolQueryResults[
        poolQueryResultStartIndex + 3
      ] as UseQueryResult<GetXvsVaultUserPendingWithdrawalsFromBeforeUpgradeOutput>;

      if (
        poolInfosQueryResult?.data &&
        poolPendingWithdrawalsBalanceQueryResult?.data?.balanceMantissa
      ) {
        tokenAddresses.push(poolInfosQueryResult.data.stakedTokenAddress);

        data[poolIndex] = {
          poolInfos: poolInfosQueryResult.data,
          userInfos: userInfoQueryResult.data,
          pendingWithdrawalsBalanceMantissa:
            poolPendingWithdrawalsBalanceQueryResult.data.balanceMantissa,
          userHasPendingWithdrawalsFromBeforeUpgrade:
            userPendingWithdrawalsFromBeforeUpgradeQueryResult.data?.userPendingWithdrawalsFromBeforeUpgradeMantissa.isGreaterThan(
              0,
            ) || false,
        };
      }
    }

    return [data, tokenAddresses];
  }, [poolQueryResults, xvsVaultPoolCountData.poolCount]);

  // Fetch pool balances
  const poolBalanceQueryResults = useGetXvsVaultPoolBalances({
    stakedTokenAddresses,
  });
  const arePoolBalanceQueriesLoading = poolBalanceQueryResults.some(
    queryResult => queryResult.isLoading,
  );

  // Index results by pool ID
  const poolBalances = useMemo(
    () =>
      indexBy(
        (_item, index) => `${index}`,
        poolBalanceQueryResults.map(poolBalanceQueryResult => poolBalanceQueryResult.data),
      ),
    [poolBalanceQueryResults],
  );

  const stakedTokens = useMemo(() => {
    const uniqueTokensByAddress: Record<string, (typeof tokens)[number]> = {};

    Object.values(poolData).forEach(({ poolInfos }) => {
      const stakedToken = findTokenByAddress({
        tokens,
        address: poolInfos.stakedTokenAddress,
      });

      if (stakedToken) {
        uniqueTokensByAddress[stakedToken.address.toLowerCase()] = stakedToken;
      }
    });

    return Object.values(uniqueTokensByAddress);
  }, [poolData, tokens]);

  const pricedTokens = useMemo(() => {
    const uniqueTokensByAddress: Record<string, (typeof tokens)[number]> = {};

    if (xvs) {
      uniqueTokensByAddress[xvs.address.toLowerCase()] = xvs;
    }

    stakedTokens.forEach(stakedToken => {
      uniqueTokensByAddress[stakedToken.address.toLowerCase()] = stakedToken;
    });

    return Object.values(uniqueTokensByAddress);
  }, [stakedTokens, xvs]);

  const { data: tokenPricesData, isLoading: isGetTokenPricesLoading } = useGetTokenListUsdPrice(
    {
      tokens: pricedTokens,
    },
    {
      enabled: pricedTokens.length > 0,
    },
  );

  const tokenPriceCentsByAddress = useMemo(() => {
    const priceCentsByAddress: Record<string, BigNumber> = {};

    pricedTokens.forEach((token, index) => {
      const isXvsOnZk = checkIsXvsOnZk({
        chainId,
        xvs,
        token,
      });

      const priceUsd = isXvsOnZk
        ? new BigNumber(XVS_FIXED_PRICE_CENTS).shiftedBy(-2)
        : tokenPricesData?.[index]?.tokenPriceUsd;

      if (priceUsd) {
        priceCentsByAddress[token.address.toLowerCase()] = convertDollarsToCents(priceUsd);
      }
    });

    return priceCentsByAddress;
  }, [chainId, pricedTokens, tokenPricesData, xvs]);

  const xvsPriceCents = xvs ? tokenPriceCentsByAddress[xvs.address.toLowerCase()] : undefined;

  const isLoading =
    isGetXvsVaultPoolCountLoading ||
    isGetXvsVaultsTotalDailyDistributedXvsLoading ||
    isGetXvsVaultTotalAllocationPointsLoading ||
    arePoolQueriesLoading ||
    arePoolBalanceQueriesLoading ||
    isGetTokenPricesLoading ||
    isGetXvsVaultPausedLoading;

  // Format query results into Vaults
  const data = useMemo(
    () =>
      Array.from({ length: xvsVaultPoolCountData.poolCount }).reduce<VenusVault[]>(
        (acc, _item, poolIndex) => {
          const lockingPeriodMs = poolData[poolIndex]?.poolInfos.lockingPeriodMs;
          const userStakeBalanceMantissa = poolData[
            poolIndex
          ]?.userInfos?.stakedAmountMantissa.minus(
            poolData[poolIndex]?.userInfos?.pendingWithdrawalsTotalAmountMantissa || 0,
          );

          const userHasPendingWithdrawalsFromBeforeUpgrade =
            poolData[poolIndex]?.userHasPendingWithdrawalsFromBeforeUpgrade;

          const pendingWithdrawalsMantissa = poolData[poolIndex]?.pendingWithdrawalsBalanceMantissa;
          const stakeBalanceMantissaData = poolBalances[poolIndex];

          const stakeBalanceMantissa = stakeBalanceMantissaData
            ? stakeBalanceMantissaData.balanceMantissa.minus(pendingWithdrawalsMantissa ?? 0)
            : new BigNumber(0);

          const stakedToken =
            poolData[poolIndex]?.poolInfos?.stakedTokenAddress &&
            findTokenByAddress({
              tokens,
              address: poolData[poolIndex]?.poolInfos.stakedTokenAddress,
            });

          const stakedTokenPriceCents = stakedToken
            ? tokenPriceCentsByAddress[stakedToken.address.toLowerCase()]
            : undefined;

          const dailyDistributedXvs =
            xvsVaultDailyDistributedXvsData?.dailyDistributedXvs !== undefined &&
            xvsVaultTotalAllocationPointsData?.totalAllocationPoints !== undefined &&
            poolData[poolIndex]?.poolInfos.allocationPoint
              ? xvsVaultDailyDistributedXvsData?.dailyDistributedXvs
                  .multipliedBy(poolData[poolIndex]?.poolInfos.allocationPoint)
                  .div(xvsVaultTotalAllocationPointsData.totalAllocationPoints)
              : undefined;

          const dailyDistributedXvsMantissa =
            dailyDistributedXvs &&
            convertTokensToMantissa({
              value: dailyDistributedXvs,
              token: xvs!,
            });

          const stakingAprPercentage = dailyDistributedXvsMantissa
            ?.multipliedBy(DAYS_PER_YEAR)
            .div(
              stakeBalanceMantissa.isGreaterThan(0) ? stakeBalanceMantissa : 1, // Prevent dividing by 0 if balance is 0
            )
            .multipliedBy(100)
            .toNumber();

          if (
            !!stakedToken &&
            lockingPeriodMs !== undefined &&
            dailyDistributedXvsMantissa !== undefined &&
            stakeBalanceMantissaData !== undefined &&
            stakedTokenPriceCents !== undefined &&
            xvsPriceCents !== undefined &&
            stakingAprPercentage !== undefined &&
            getXvsVaultPausedData?.isVaultPaused !== undefined &&
            !!xvs
          ) {
            const { stakeBalanceCents, userStakeBalanceCents, dailyEmissionCents } =
              calculateVaultCentsValues({
                stakedTokenDecimals: stakedToken.decimals,
                rewardTokenDecimals: xvs.decimals,
                stakedTokenPriceCents,
                rewardTokenPriceCents: xvsPriceCents,
                stakeBalanceMantissa,
                userStakeBalanceMantissa,
                dailyEmissionMantissa: dailyDistributedXvsMantissa,
              });

            if (dailyEmissionCents === undefined) {
              return acc;
            }

            const vault = formatToVenusVault({
              isPaused: getXvsVaultPausedData.isVaultPaused,
              rewardToken: xvs,
              stakedToken,
              stakedTokenPriceCents,
              rewardTokenPriceCents: xvsPriceCents,
              lockingPeriodMs,
              dailyEmissionMantissa: dailyDistributedXvsMantissa,
              dailyEmissionCents,
              stakeBalanceMantissa,
              stakeBalanceCents,
              stakingAprPercentage,
              userStakeBalanceMantissa,
              userStakeBalanceCents,
              poolIndex,
              userHasPendingWithdrawalsFromBeforeUpgrade,
            });

            return [...acc, vault];
          }

          return acc;
        },
        [],
      ),
    [
      xvsVaultPoolCountData.poolCount,
      poolData,
      poolBalances,
      tokenPriceCentsByAddress,
      xvsPriceCents,
      xvsVaultDailyDistributedXvsData?.dailyDistributedXvs,
      xvsVaultTotalAllocationPointsData?.totalAllocationPoints,
      getXvsVaultPausedData?.isVaultPaused,
      xvs,
      tokens,
    ],
  );

  return {
    data,
    isLoading,
  };
};
