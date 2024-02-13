import { useMemo } from 'react';
import { UseQueryResult } from 'react-query';

import {
  GetXvsVaultPendingWithdrawalsFromBeforeUpgradeOutput,
  GetXvsVaultPoolInfoOutput,
  GetXvsVaultUserInfoOutput,
  useGetXvsVaultPaused,
  useGetXvsVaultPoolCount,
  useGetXvsVaultRewardPerBlock,
  useGetXvsVaultTotalAllocationPoints,
} from 'clients/api';
import { DAYS_PER_YEAR } from 'constants/daysPerYear';
import { useGetChainMetadata } from 'hooks/useGetChainMetadata';
import { useGetToken, useGetTokens } from 'libs/tokens';
import { Vault } from 'types';
import { indexBy } from 'utilities';
import findTokenByAddress from 'utilities/findTokenByAddress';

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
  const { blocksPerDay } = useGetChainMetadata();

  const xvs = useGetToken({
    symbol: 'XVS',
  });
  const tokens = useGetTokens();

  const {
    data: xvsVaultPoolCountData = { poolCount: 0 },
    isLoading: isGetXvsVaultPoolCountLoading,
  } = useGetXvsVaultPoolCount();

  // Fetch data generic to all XVS pools
  const { data: xvsVaultRewardMantissaPerBlock, isLoading: isGetXvsVaultRewardPerBlockLoading } =
    useGetXvsVaultRewardPerBlock(
      {
        tokenAddress: xvs!.address, // We ensure XVS exists through the enabled option
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
        userInfos?: GetXvsVaultUserInfoOutput;
        hasPendingWithdrawalsFromBeforeUpgrade: boolean;
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

      const userInfoQueryResult = poolQueryResults[
        poolQueryResultStartIndex + 1
      ] as UseQueryResult<GetXvsVaultUserInfoOutput>;

      const userPendingWithdrawalsFromBeforeUpgradeQueryResult = poolQueryResults[
        poolQueryResultStartIndex + 2
      ] as UseQueryResult<GetXvsVaultPendingWithdrawalsFromBeforeUpgradeOutput>;

      if (poolInfosQueryResult?.data) {
        tokenAddresses.push(poolInfosQueryResult.data.stakedTokenAddress);

        data[poolIndex] = {
          poolInfos: poolInfosQueryResult.data,
          userInfos: userInfoQueryResult.data,
          hasPendingWithdrawalsFromBeforeUpgrade:
            userPendingWithdrawalsFromBeforeUpgradeQueryResult.data?.pendingWithdrawalsFromBeforeUpgradeMantissa.isGreaterThan(
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
    isGetXvsVaultRewardPerBlockLoading ||
    isGetXvsVaultTotalAllocationPointsLoading ||
    arePoolQueriesLoading ||
    arePoolBalanceQueriesLoading ||
    isGetXvsVaultPausedLoading;

  // Format query results into Vaults
  const data: Vault[] = useMemo(
    () =>
      Array.from({ length: xvsVaultPoolCountData.poolCount }).reduce<Vault[]>(
        (acc, _item, poolIndex) => {
          const totalStakedMantissaData = poolBalances[poolIndex];
          const lockingPeriodMs = poolData[poolIndex]?.poolInfos.lockingPeriodMs;
          const userStakedMantissa = poolData[poolIndex]?.userInfos?.stakedAmountMantissa.minus(
            poolData[poolIndex]?.userInfos?.pendingWithdrawalsTotalAmountMantissa || 0,
          );
          const hasPendingWithdrawalsFromBeforeUpgrade =
            poolData[poolIndex]?.hasPendingWithdrawalsFromBeforeUpgrade;

          const stakedToken =
            poolData[poolIndex]?.poolInfos?.stakedTokenAddress &&
            findTokenByAddress({
              tokens,
              address: poolData[poolIndex]?.poolInfos.stakedTokenAddress,
            });

          const poolRewardMantissaPerBlock =
            xvsVaultRewardMantissaPerBlock?.rewardPerBlockMantissa !== undefined &&
            xvsVaultTotalAllocationPointsData?.totalAllocationPoints !== undefined &&
            poolData[poolIndex]?.poolInfos.allocationPoint
              ? xvsVaultRewardMantissaPerBlock.rewardPerBlockMantissa
                  .multipliedBy(poolData[poolIndex]?.poolInfos.allocationPoint)
                  .div(xvsVaultTotalAllocationPointsData.totalAllocationPoints)
              : undefined;

          const dailyEmissionMantissa =
            poolRewardMantissaPerBlock && poolRewardMantissaPerBlock.multipliedBy(blocksPerDay);

          const stakingAprPercentage =
            dailyEmissionMantissa &&
            totalStakedMantissaData &&
            dailyEmissionMantissa
              .multipliedBy(DAYS_PER_YEAR)
              .div(
                totalStakedMantissaData.balanceMantissa.isGreaterThan(0)
                  ? totalStakedMantissaData.balanceMantissa
                  : 1, // Prevent dividing by 0 if balance is 0
              )
              .multipliedBy(100)
              .toNumber();

          if (
            !!stakedToken &&
            lockingPeriodMs !== undefined &&
            dailyEmissionMantissa !== undefined &&
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
              dailyEmissionMantissa,
              totalStakedMantissa: totalStakedMantissaData.balanceMantissa,
              stakingAprPercentage,
              userStakedMantissa,
              poolIndex,
              hasPendingWithdrawalsFromBeforeUpgrade,
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
      xvsVaultRewardMantissaPerBlock?.rewardPerBlockMantissa,
      xvsVaultTotalAllocationPointsData?.totalAllocationPoints,
      getXvsVaultPausedData?.isVaultPaused,
      xvs,
      tokens,
      blocksPerDay,
    ],
  );

  return {
    data,
    isLoading,
  };
};

export default useGetVestingVaults;
