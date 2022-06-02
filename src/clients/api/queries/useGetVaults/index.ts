import { UseQueryResult } from 'react-query';

import { Vault } from 'types';
import { XVS_TOKEN_ADDRESS } from './constants';
import useGetXvsVaultPoolsCount from '../useGetXvsVaultPoolsCount';
import useGetXvsVaultTotalAllocationPoints from '../useGetXvsVaultTotalAllocationPoints';
import useGetXvsVaultRewardWeiPerBlock from '../useGetXvsVaultRewardWeiPerBlock';
import { GetXvsVaultPoolInfosOutput } from '../getXvsVaultPoolInfos';
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

  console.warn(xvsVaultRewardWeiPerBlock, xvsVaultTotalAllocationPoints);

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

  const poolBalanceQueryResults = useGetXvsVaultPoolBalances({
    stakedTokenAddresses,
  });

  const arePoolBalanceQueriesLoading = poolBalanceQueryResults.some(
    queryResult => queryResult.isLoading,
  );

  console.log('poolQueryResults', poolQueryResults);
  console.log('poolBalanceQueryResults', poolBalanceQueryResults);

  const isLoading =
    isGetXvsVaultPoolsCountLoading ||
    isGetXvsVaultRewardWeiPerBlockLoading ||
    isGetXvsVaultTotalAllocationPointsLoading ||
    arePoolQueriesLoading ||
    arePoolBalanceQueriesLoading;

  // TODO: format data and return Vaults

  return {
    data: [],
    isLoading,
    // TODO: handle errors and retry scenarios
  };
};

export default useGetVaults;
