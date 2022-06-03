import { useMemo } from 'react';
import { UseQueryResult } from 'react-query';

import { Vault } from 'types';
import { BLOCKS_PER_DAY } from 'constants/blocksPerDay';
import { DAYS_PER_YEAR } from 'constants/daysPerYear';
import { getTokenByAddress } from 'utilities';
import { indexBy } from 'utilities/common';
import {
  useGetXvsVaultPoolsCount,
  useGetXvsVaultTotalAllocationPoints,
  useGetXvsVaultRewardWeiPerBlock,
  GetXvsVaultPoolInfosOutput,
  GetXvsVaultPendingRewardWeiOutput,
  IGetXvsVaultUserInfoOutput,
} from 'clients/api';
import { XVS_TOKEN_ADDRESS, XVS_TOKEN_ID } from './constants';
import useGetXvsVaultPools from './useGetXvsVaultPools';
import useGetXvsVaultPoolBalances from './useGetXvsVaultPoolBalances';

export interface UseGetVaultsOutput {
  isLoading: boolean;
  data: Vault[];
}

// TODO: fetch non-vesting vaults
const useGetVaults = ({ accountAddress }: { accountAddress?: string }): UseGetVaultsOutput => {
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
  const poolData: {
    [poolIndex: string]: {
      poolInfos: GetXvsVaultPoolInfosOutput;
      userPendingRewardWei?: GetXvsVaultPendingRewardWeiOutput;
      userInfos?: IGetXvsVaultUserInfoOutput;
    };
  } = {};

  const queriesPerPoolCount =
    xvsVaultPoolsCount > 0 ? poolQueryResults.length / xvsVaultPoolsCount : 0;

  for (let poolIndex = 0; poolIndex < xvsVaultPoolsCount; poolIndex++) {
    const poolQueryResultStartIndex = poolIndex * queriesPerPoolCount;

    const poolInfosQueryResult = poolQueryResults[
      poolQueryResultStartIndex
    ] as UseQueryResult<GetXvsVaultPoolInfosOutput>;

    const userPendingRewardQueryResult = poolQueryResults[
      poolQueryResultStartIndex + 1
    ] as UseQueryResult<GetXvsVaultPendingRewardWeiOutput>;

    const userInfoQueryResult = poolQueryResults[
      poolQueryResultStartIndex + 2
    ] as UseQueryResult<IGetXvsVaultUserInfoOutput>;

    if (poolInfosQueryResult?.data) {
      poolData[poolIndex] = {
        poolInfos: poolInfosQueryResult.data,
        userInfos: userInfoQueryResult.data,
        userPendingRewardWei: userPendingRewardQueryResult.data,
      };
    }
  }

  // Get addresses of tokens staked in pools, sorted by pool index
  const stakedTokenAddresses = Object.keys(poolData)
    .filter(key => Object.prototype.hasOwnProperty.call(poolData, key))
    .map(poolIndex => poolData[poolIndex].poolInfos.stakedTokenAddress);

  // Fetch pool balances
  const poolBalanceQueryResults = useGetXvsVaultPoolBalances({
    stakedTokenAddresses,
  });
  const arePoolBalanceQueriesLoading = poolBalanceQueryResults.some(
    queryResult => queryResult.isLoading,
  );

  // Index results by pool ID
  const poolBalances = indexBy(
    (_item, index) => `${index}`,
    poolBalanceQueryResults.map(poolBalanceQueryResult => poolBalanceQueryResult.data),
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
            poolIndex,
            rewardTokenId: XVS_TOKEN_ID,
            stakedTokenId,
            lockingPeriodMs,
            dailyEmissionWei,
            totalStakedWei,
            stakingAprPercentage,
            userStakedWei,
            userPendingRewardWei,
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

export default useGetVaults;
