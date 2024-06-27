import type { UseQueryResult } from '@tanstack/react-query';
import { useMemo } from 'react';

import {
  type GetXvsVaultPendingWithdrawalsBalanceOutput,
  type GetXvsVaultPoolInfoOutput,
  type GetXvsVaultUserInfoOutput,
  type GetXvsVaultUserPendingWithdrawalsFromBeforeUpgradeOutput,
  useGetXvsVaultPaused,
  useGetXvsVaultPoolCount,
  useGetXvsVaultTotalAllocationPoints,
  useGetXvsVaultsTotalDailyDistributedXvs,
} from 'clients/api';
import { DAYS_PER_YEAR } from 'constants/time';
import { useGetToken, useGetTokens } from 'libs/tokens';
import type { Vault } from 'types';
import { convertTokensToMantissa, indexBy } from 'utilities';
import findTokenByAddress from 'utilities/findTokenByAddress';

import BigNumber from 'bignumber.js';
import useGetXvsVaultPoolBalances from './useGetXvsVaultPoolBalances';
import useGetXvsVaultPools from './useGetXvsVaultPools';

export interface UseGetVestingVaultsOutput {
  isLoading: boolean;
  data: Vault[];
}

const useGetVestingVaults = ({
  accountAddress,
}: {
  accountAddress?: string;
}): UseGetVestingVaultsOutput => {
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
    accountAddress,
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

  const isLoading =
    isGetXvsVaultPoolCountLoading ||
    isGetXvsVaultsTotalDailyDistributedXvsLoading ||
    isGetXvsVaultTotalAllocationPointsLoading ||
    arePoolQueriesLoading ||
    arePoolBalanceQueriesLoading ||
    isGetXvsVaultPausedLoading;

  // Format query results into Vaults
  const data: Vault[] = useMemo(
    () =>
      Array.from({ length: xvsVaultPoolCountData.poolCount }).reduce<Vault[]>(
        (acc, _item, poolIndex) => {
          const lockingPeriodMs = poolData[poolIndex]?.poolInfos.lockingPeriodMs;
          const userStakedMantissa = poolData[poolIndex]?.userInfos?.stakedAmountMantissa.minus(
            poolData[poolIndex]?.userInfos?.pendingWithdrawalsTotalAmountMantissa || 0,
          );

          const userHasPendingWithdrawalsFromBeforeUpgrade =
            poolData[poolIndex]?.userHasPendingWithdrawalsFromBeforeUpgrade;

          const pendingWithdrawalsMantissa = poolData[poolIndex]?.pendingWithdrawalsBalanceMantissa;
          const totalStakedMantissaData = poolBalances[poolIndex];

          const totalStakedMantissa = totalStakedMantissaData
            ? totalStakedMantissaData.balanceMantissa.minus(pendingWithdrawalsMantissa ?? 0)
            : new BigNumber(0);

          const stakedToken =
            poolData[poolIndex]?.poolInfos?.stakedTokenAddress &&
            findTokenByAddress({
              tokens,
              address: poolData[poolIndex]?.poolInfos.stakedTokenAddress,
            });

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
              totalStakedMantissa.isGreaterThan(0) ? totalStakedMantissa : 1, // Prevent dividing by 0 if balance is 0
            )
            .multipliedBy(100)
            .toNumber();

          if (
            !!stakedToken &&
            lockingPeriodMs !== undefined &&
            dailyDistributedXvsMantissa !== undefined &&
            totalStakedMantissaData !== undefined &&
            stakingAprPercentage !== undefined &&
            getXvsVaultPausedData?.isVaultPaused !== undefined &&
            !!xvs
          ) {
            const vault: Vault = {
              isPaused: getXvsVaultPausedData.isVaultPaused,
              rewardToken: xvs,
              stakedToken,
              lockingPeriodMs,
              dailyEmissionMantissa: dailyDistributedXvsMantissa,
              totalStakedMantissa,
              stakingAprPercentage,
              userStakedMantissa,
              poolIndex,
              userHasPendingWithdrawalsFromBeforeUpgrade,
            };

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

export default useGetVestingVaults;
