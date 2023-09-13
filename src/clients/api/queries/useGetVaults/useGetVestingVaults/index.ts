import { useMemo } from 'react';
import { UseQueryResult } from 'react-query';
import { Vault, VenusTokenSymbol } from 'types';
import { getTokenByAddress, indexBy } from 'utilities';

import {
  GetXvsVaultPendingWithdrawalsFromBeforeUpgradeOutput,
  GetXvsVaultPoolInfoOutput,
  GetXvsVaultUserInfoOutput,
  useGetXvsVaultPoolCount,
  useGetXvsVaultRewardPerBlock,
  useGetXvsVaultTotalAllocationPoints,
} from 'clients/api';
import { BLOCKS_PER_DAY } from 'constants/bsc';
import { DAYS_PER_YEAR } from 'constants/daysPerYear';
import useGetVenusToken from 'hooks/useGetVenusToken';

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
  const xvs = useGetVenusToken({
    symbol: VenusTokenSymbol.XVS,
  });

  const {
    data: xvsVaultPoolCountData = { poolCount: 0 },
    isLoading: isGetXvsVaultPoolCountLoading,
  } = useGetXvsVaultPoolCount();

  // Fetch data generic to all XVS pools
  const { data: xvsVaultRewardWeiPerBlock, isLoading: isGetXvsVaultRewardPerBlockLoading } =
    useGetXvsVaultRewardPerBlock(
      {
        tokenAddress: xvs!.address, // We ensure vai exists through the enabled option
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
      tokenAddress: xvs!.address, // We ensure vai exists through the enabled option
    },
    {
      enabled: !!xvs,
    },
  );

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
            userPendingWithdrawalsFromBeforeUpgradeQueryResult.data?.pendingWithdrawalsFromBeforeUpgradeWei.isGreaterThan(
              0,
            ) || false,
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
          const hasPendingWithdrawalsFromBeforeUpgrade =
            poolData[poolIndex]?.hasPendingWithdrawalsFromBeforeUpgrade;

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
            stakingAprPercentage &&
            xvs
          ) {
            const vault: Vault = {
              rewardToken: xvs,
              stakedToken,
              lockingPeriodMs,
              dailyEmissionWei,
              totalStakedWei: totalStakedWeiData.balanceWei,
              stakingAprPercentage,
              userStakedWei,
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
      JSON.stringify(poolData),
      JSON.stringify(poolBalances),
      xvsVaultRewardWeiPerBlock?.rewardPerBlockWei.toFixed(),
      xvsVaultTotalAllocationPointsData?.totalAllocationPoints,
      xvs,
    ],
  );

  return {
    data,
    isLoading,
  };
};

export default useGetVestingVaults;
