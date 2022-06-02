import { useMemo } from 'react';
import { UseQueryResult } from 'react-query';

import { Vault } from 'types';
import { BLOCKS_PER_DAY } from 'constants/blocksPerDay';
import { DAYS_PER_YEAR } from 'constants/daysPerYear';
import { getTokenByAddress } from 'utilities';
import { convertWeiToCoins } from 'utilities/common';
import { XVS_TOKEN_ADDRESS, XVS_TOKEN_ID } from './constants';
import useGetXvsVaultPoolsCount from '../useGetXvsVaultPoolsCount';
import useGetXvsVaultTotalAllocationPoints from '../useGetXvsVaultTotalAllocationPoints';
import useGetXvsVaultRewardWeiPerBlock from '../useGetXvsVaultRewardWeiPerBlock';
import { GetXvsVaultPoolInfosOutput } from '../getXvsVaultPoolInfos';
import { GetXvsVaultPendingRewardWeiOutput } from '../getXvsVaultPendingRewardWei';
import { IGetXvsVaultUserInfoOutput } from '../getXvsVaultUserInfo';
import useGetXvsVaultPools from './useGetXvsVaultPools';
import useGetXvsVaultPoolBalances from './useGetXvsVaultPoolBalances';

export interface UseGetVaultsOutput {
  isLoading: boolean;
  data: Vault[];
}

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

  // Get addresses of tokens staked in pools, sorted by pool index
  const queriesPerPoolCount =
    xvsVaultPoolsCount > 0 ? poolQueryResults.length / xvsVaultPoolsCount : 0;

  const stakedTokenAddresses = Array.from({ length: xvsVaultPoolsCount }).map((_, poolIndex) => {
    const poolInfosQueryResultIndex = poolIndex * queriesPerPoolCount;
    const poolInfosQueryResult = poolQueryResults[
      poolInfosQueryResultIndex
    ] as UseQueryResult<GetXvsVaultPoolInfosOutput>;
    return poolInfosQueryResult.data?.stakedTokenAddress;
  });

  // Fetch pool balances
  const poolBalanceQueryResults = useGetXvsVaultPoolBalances({
    stakedTokenAddresses,
  });
  const arePoolBalanceQueriesLoading = poolBalanceQueryResults.some(
    queryResult => queryResult.isLoading,
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

        const poolInfos = poolInfosQueryResult.data;
        const totalStakedAmountWei = poolBalanceQueryResults[poolIndex].data;
        const lockingPeriodMs = poolInfos?.lockingPeriodMs;
        const userStakedAmountWei = userInfoQueryResult.data?.stakedAmountWei;
        const userPendingRewardAmountWei = userPendingRewardQueryResult.data;

        const stakedTokenId =
          poolInfos?.stakedTokenAddress && getTokenByAddress(poolInfos.stakedTokenAddress)?.id;

        const vaultRewardWeiPerBlock =
          xvsVaultRewardWeiPerBlock &&
          xvsVaultTotalAllocationPoints &&
          poolInfos?.allocationPoint &&
          xvsVaultRewardWeiPerBlock
            .multipliedBy(poolInfos?.allocationPoint)
            .div(xvsVaultTotalAllocationPoints);

        const dailyEmissionAmountWei =
          vaultRewardWeiPerBlock && vaultRewardWeiPerBlock.multipliedBy(BLOCKS_PER_DAY);

        let stakeApr: number | undefined;

        if (dailyEmissionAmountWei && totalStakedAmountWei) {
          const dailyEmissionAmountTokens = convertWeiToCoins({
            valueWei: dailyEmissionAmountWei,
            tokenId: XVS_TOKEN_ID,
          });

          stakeApr = dailyEmissionAmountTokens
            .multipliedBy(DAYS_PER_YEAR)
            .div(totalStakedAmountWei)
            .toNumber();
        }

        if (
          stakedTokenId &&
          lockingPeriodMs &&
          vaultRewardWeiPerBlock &&
          dailyEmissionAmountWei &&
          totalStakedAmountWei &&
          stakeApr
        ) {
          const vault: Vault = {
            poolIndex,
            stakedTokenId,
            rewardTokenId: XVS_TOKEN_ID,
            lockingPeriodMs,
            dailyEmissionAmountWei,
            stakeApr,
            totalStakedAmountWei,
            userStakedAmountWei,
            userPendingRewardAmountWei,
          };

          return [...acc, vault];
        }

        return acc;
      }, []),
    [
      queriesPerPoolCount,
      xvsVaultPoolsCount,
      JSON.stringify(poolQueryResults),
      JSON.stringify(poolBalanceQueryResults),
      xvsVaultRewardWeiPerBlock?.toFixed(),
      xvsVaultTotalAllocationPoints,
    ],
  );

  return {
    data,
    isLoading,
    // TODO: handle errors and retry scenarios
  };
};

export default useGetVaults;
