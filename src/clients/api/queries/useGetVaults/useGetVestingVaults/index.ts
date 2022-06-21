import { useMemo } from 'react';
import { UseQueryResult } from 'react-query';

import { Vault } from 'types';
import { BLOCKS_PER_DAY } from 'constants/bsc';
import { DAYS_PER_YEAR } from 'constants/daysPerYear';
import { getTokenByAddress, indexBy } from 'utilities';
import {
  useGetXvsVaultPoolsCount,
  useGetXvsVaultTotalAllocationPoints,
  useGetXvsVaultRewardWeiPerBlock,
  IGetXvsVaultPoolInfoOutput,
  GetXvsVaultPendingRewardWeiOutput,
  IGetXvsVaultUserInfoOutput,
} from 'clients/api';
import { XVS_TOKEN_ADDRESS, XVS_TOKEN_ID } from 'constants/xvs';
import useGetXvsVaultPools from './useGetXvsVaultPools';
import useGetXvsVaultPoolBalances from './useGetXvsVaultPoolBalances';

export interface UseGetVestingVaultsOutput {
  isLoading: boolean;
  data: Vault[];
}

const useGetVestingVaults = ({
  accountAddress,
}: {
  accountAddress?: string;
}): UseGetVestingVaultsOutput => {
  const { data: xvsVaultPoolsCount = 0, isLoading: isGetXvsVaultPoolsCountLoading } =
    useGetXvsVaultPoolsCount();

  // Fetch data generic to all XVS pools
  const { data: xvsVaultRewardWeiPerBlock, isLoading: isGetXvsVaultRewardWeiPerBlockLoading } =
    useGetXvsVaultRewardWeiPerBlock({
      tokenAddress: XVS_TOKEN_ADDRESS,
    });

  const {
    data: xvsVaultTotalAllocationPoints,
    isLoading: isGetXvsVaultTotalAllocationPointsLoading,
  } = useGetXvsVaultTotalAllocationPoints({
    tokenAddress: XVS_TOKEN_ADDRESS,
  });

  // Fetch pools
  const poolQueryResults = useGetXvsVaultPools({
    accountAddress,
    poolsCount: xvsVaultPoolsCount,
  });
  const arePoolQueriesLoading = poolQueryResults.some(queryResult => queryResult.isLoading);

  // Index results by pool ID
  const [poolData, stakedTokenAddresses] = useMemo(() => {
    const data: {
      [poolIndex: string]: {
        poolInfos: IGetXvsVaultPoolInfoOutput;
        userPendingRewardWei?: GetXvsVaultPendingRewardWeiOutput;
        userInfos?: IGetXvsVaultUserInfoOutput;
      };
    } = {};

    const tokenAddresses: string[] = [];

    const queriesPerPoolCount =
      xvsVaultPoolsCount > 0 ? poolQueryResults.length / xvsVaultPoolsCount : 0;

    for (let poolIndex = 0; poolIndex < xvsVaultPoolsCount; poolIndex++) {
      const poolQueryResultStartIndex = poolIndex * queriesPerPoolCount;

      const poolInfosQueryResult = poolQueryResults[
        poolQueryResultStartIndex
      ] as UseQueryResult<IGetXvsVaultPoolInfoOutput>;

      const userPendingRewardQueryResult = poolQueryResults[
        poolQueryResultStartIndex + 1
      ] as UseQueryResult<GetXvsVaultPendingRewardWeiOutput>;

      const userInfoQueryResult = poolQueryResults[
        poolQueryResultStartIndex + 2
      ] as UseQueryResult<IGetXvsVaultUserInfoOutput>;

      if (poolInfosQueryResult?.data) {
        tokenAddresses.push(poolInfosQueryResult.data.stakedTokenAddress);

        data[poolIndex] = {
          poolInfos: poolInfosQueryResult.data,
          userInfos: userInfoQueryResult.data,
          userPendingRewardWei: userPendingRewardQueryResult.data,
        };
      }
    }

    return [data, tokenAddresses];
  }, [JSON.stringify(poolQueryResults), xvsVaultPoolsCount]);

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
    isGetXvsVaultPoolsCountLoading ||
    isGetXvsVaultRewardWeiPerBlockLoading ||
    isGetXvsVaultTotalAllocationPointsLoading ||
    arePoolQueriesLoading ||
    arePoolBalanceQueriesLoading;

  // Format query results into Vaults
  const data: Vault[] = useMemo(
    () =>
      Array.from({ length: xvsVaultPoolsCount }).reduce<Vault[]>((acc, _item, poolIndex) => {
        const totalStakedWei = poolBalances[poolIndex];
        const lockingPeriodMs = poolData[poolIndex]?.poolInfos.lockingPeriodMs;
        const userStakedWei = poolData[poolIndex]?.userInfos?.stakedAmountWei;
        const userPendingRewardWei = poolData[poolIndex]?.userPendingRewardWei;

        const stakedTokenId =
          poolData[poolIndex]?.poolInfos?.stakedTokenAddress &&
          getTokenByAddress(poolData[poolIndex]?.poolInfos.stakedTokenAddress)?.id;

        const poolRewardWeiPerBlock =
          xvsVaultRewardWeiPerBlock &&
          xvsVaultTotalAllocationPoints &&
          poolData[poolIndex]?.poolInfos.allocationPoint &&
          xvsVaultRewardWeiPerBlock
            .multipliedBy(poolData[poolIndex]?.poolInfos.allocationPoint)
            .div(xvsVaultTotalAllocationPoints);

        const dailyEmissionWei =
          poolRewardWeiPerBlock && poolRewardWeiPerBlock.multipliedBy(BLOCKS_PER_DAY);

        const stakingAprPercentage =
          dailyEmissionWei &&
          totalStakedWei &&
          dailyEmissionWei
            .multipliedBy(DAYS_PER_YEAR)
            .div(totalStakedWei)
            .multipliedBy(100)
            .toNumber();

        if (
          stakedTokenId &&
          lockingPeriodMs &&
          dailyEmissionWei &&
          totalStakedWei &&
          stakingAprPercentage
        ) {
          const vault: Vault = {
            rewardTokenId: XVS_TOKEN_ID,
            stakedTokenId,
            lockingPeriodMs,
            dailyEmissionWei,
            totalStakedWei,
            stakingAprPercentage,
            userStakedWei,
            userPendingRewardWei,
            poolIndex,
          };

          return [...acc, vault];
        }

        return acc;
      }, []),
    [
      xvsVaultPoolsCount,
      JSON.stringify(poolData),
      JSON.stringify(poolBalances),
      xvsVaultRewardWeiPerBlock?.toFixed(),
      xvsVaultTotalAllocationPoints,
    ],
  );

  return {
    data,
    isLoading,
  };
};

export default useGetVestingVaults;
