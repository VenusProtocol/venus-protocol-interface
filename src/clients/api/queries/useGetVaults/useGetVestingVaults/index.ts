import { useMemo } from 'react';
import { UseQueryResult } from 'react-query';
import { Vault } from 'types';
import { getTokenByAddress, indexBy } from 'utilities';

import {
  GetXvsVaultPendingRewardOutput,
  GetXvsVaultPoolInfoOutput,
  GetXvsVaultUserInfoOutput,
  useGetXvsVaultPoolCount,
  useGetXvsVaultRewardPerBlock,
  useGetXvsVaultTotalAllocationPoints,
} from 'clients/api';
import { BLOCKS_PER_DAY } from 'constants/bsc';
import { DAYS_PER_YEAR } from 'constants/daysPerYear';
import { TOKENS } from 'constants/tokens';

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
  const {
    data: xvsVaultPoolCountData = { poolCount: 0 },
    isLoading: isGetXvsVaultPoolCountLoading,
  } = useGetXvsVaultPoolCount();

  // Fetch data generic to all XVS pools
  const { data: xvsVaultRewardWeiPerBlock, isLoading: isGetXvsVaultRewardPerBlockLoading } =
    useGetXvsVaultRewardPerBlock({
      tokenAddress: TOKENS.xvs.address,
    });

  const {
    data: xvsVaultTotalAllocationPointsData,
    isLoading: isGetXvsVaultTotalAllocationPointsLoading,
  } = useGetXvsVaultTotalAllocationPoints({
    tokenAddress: TOKENS.xvs.address,
  });

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
        userPendingReward?: GetXvsVaultPendingRewardOutput;
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

      const userPendingRewardQueryResult = poolQueryResults[
        poolQueryResultStartIndex + 1
      ] as UseQueryResult<GetXvsVaultPendingRewardOutput>;

      const userInfoQueryResult = poolQueryResults[
        poolQueryResultStartIndex + 2
      ] as UseQueryResult<GetXvsVaultUserInfoOutput>;

      if (poolInfosQueryResult?.data) {
        tokenAddresses.push(poolInfosQueryResult.data.stakedTokenAddress);

        data[poolIndex] = {
          poolInfos: poolInfosQueryResult.data,
          userInfos: userInfoQueryResult.data,
          userPendingReward: userPendingRewardQueryResult.data,
        };
      }
    }

    return [data, tokenAddresses];
  }, [JSON.stringify(poolQueryResults), xvsVaultPoolCountData.poolCount]);

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
    [JSON.stringify(poolBalanceQueryResults)],
  );

  const isLoading =
    isGetXvsVaultPoolCountLoading ||
    isGetXvsVaultRewardPerBlockLoading ||
    isGetXvsVaultTotalAllocationPointsLoading ||
    arePoolQueriesLoading ||
    arePoolBalanceQueriesLoading;

  // Format query results into Vaults
  const data: Vault[] = useMemo(
    () =>
      Array.from({ length: xvsVaultPoolCountData.poolCount }).reduce<Vault[]>(
        (acc, _item, poolIndex) => {
          const totalStakedWeiData = poolBalances[poolIndex];
          const lockingPeriodMs = poolData[poolIndex]?.poolInfos.lockingPeriodMs;
          const userStakedWei = poolData[poolIndex]?.userInfos?.stakedAmountWei;
          const userPendingRewardWei = poolData[poolIndex]?.userPendingReward?.pendingXvsReward;

          const stakedToken =
            poolData[poolIndex]?.poolInfos?.stakedTokenAddress &&
            getTokenByAddress(poolData[poolIndex]?.poolInfos.stakedTokenAddress);

          const poolRewardWeiPerBlock =
            xvsVaultRewardWeiPerBlock?.rewardPerBlockWei &&
            xvsVaultTotalAllocationPointsData?.totalAllocationPoints &&
            poolData[poolIndex]?.poolInfos.allocationPoint &&
            xvsVaultRewardWeiPerBlock.rewardPerBlockWei
              .multipliedBy(poolData[poolIndex]?.poolInfos.allocationPoint)
              .div(xvsVaultTotalAllocationPointsData.totalAllocationPoints);

          const dailyEmissionWei =
            poolRewardWeiPerBlock && poolRewardWeiPerBlock.multipliedBy(BLOCKS_PER_DAY);

          const stakingAprPercentage =
            dailyEmissionWei &&
            totalStakedWeiData &&
            dailyEmissionWei
              .multipliedBy(DAYS_PER_YEAR)
              .div(totalStakedWeiData.balanceWei)
              .multipliedBy(100)
              .toNumber();

          if (
            stakedToken &&
            lockingPeriodMs &&
            dailyEmissionWei &&
            totalStakedWeiData &&
            stakingAprPercentage
          ) {
            const vault: Vault = {
              rewardToken: TOKENS.xvs,
              stakedToken,
              lockingPeriodMs,
              dailyEmissionWei,
              totalStakedWei: totalStakedWeiData.balanceWei,
              stakingAprPercentage,
              userStakedWei,
              userPendingRewardWei,
              poolIndex,
            };

            return [...acc, vault];
          }

          return acc;
        },
        [],
      ),
    [
      xvsVaultPoolCountData.poolCount,
      JSON.stringify(poolData),
      JSON.stringify(poolBalances),
      xvsVaultRewardWeiPerBlock?.rewardPerBlockWei.toFixed(),
      xvsVaultTotalAllocationPointsData?.totalAllocationPoints,
    ],
  );

  return {
    data,
    isLoading,
  };
};

export default useGetVestingVaults;
