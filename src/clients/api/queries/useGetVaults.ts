import { useQueries, UseQueryOptions, UseQueryResult } from 'react-query';

import { Vault } from 'types';
import { getToken } from 'utilities';
import FunctionKey from 'constants/functionKey';
import { useWeb3 } from 'clients/web3';
import { Bep20 } from 'types/contracts';
import { getTokenContractByAddress } from 'clients/contracts';
import { useXvsVaultContract } from 'clients/contracts/hooks';
import useGetXvsVaultPoolsCount from './useGetXvsVaultPoolsCount';
import useGetXvsVaultTotalAllocationPoints from './useGetXvsVaultTotalAllocationPoints';
import useGetXvsVaultRewardWeiPerBlock from './useGetXvsVaultRewardWeiPerBlock';
import getXvsVaultPoolInfos, { GetXvsVaultPoolInfosOutput } from './getXvsVaultPoolInfos';
import getXvsVaultPendingReward, {
  GetXvsVaultPendingRewardWeiOutput,
} from './getXvsVaultPendingRewardWei';
import getXvsVaultUserInfo, { IGetXvsVaultUserInfoOutput } from './getXvsVaultUserInfo';
import getBalanceOf, { GetBalanceOfOutput } from './getBalanceOf';

export interface UseGetVaultsOutput {
  isLoading: boolean;
  data: Vault[];
}

const xvsTokenAddress = getToken('xvs').address;

const useGetVaults = ({ accountAddress }: { accountAddress?: string }): UseGetVaultsOutput => {
  const web3 = useWeb3();
  const xvsVaultContract = useXvsVaultContract();

  const { data: xvsVaultPoolsCount = 0, isLoading: isGetXvsVaultPoolsCountLoading } =
    useGetXvsVaultPoolsCount();

  // Fetch data generic to all XVS pools
  const { data: xvsVaultRewardWeiPerBlock, isLoading: isGetXvsVaultRewardWeiPerBlockLoading } =
    useGetXvsVaultRewardWeiPerBlock({
      tokenAddress: xvsTokenAddress,
    });

  const {
    data: xvsVaultTotalAllocationPoints,
    isLoading: isGetXvsVaultTotalAllocationPointsLoading,
  } = useGetXvsVaultTotalAllocationPoints({
    tokenAddress: xvsTokenAddress,
  });

  console.warn(xvsVaultRewardWeiPerBlock, xvsVaultTotalAllocationPoints);

  // TODO: improve type
  const poolQueries: UseQueryOptions<
    GetXvsVaultPoolInfosOutput | GetXvsVaultPendingRewardWeiOutput | IGetXvsVaultUserInfoOutput
  >[] = [];

  // Fetch pool infos
  for (let poolIndex = 0; poolIndex < xvsVaultPoolsCount; poolIndex++) {
    poolQueries.push({
      queryFn: () =>
        getXvsVaultPoolInfos({
          xvsVaultContract,
          tokenAddress: xvsTokenAddress,
          poolIndex,
        }),
      queryKey: [FunctionKey.GET_XVS_VAULT_POOL_INFOS, xvsTokenAddress, poolIndex],
    });

    poolQueries.push({
      queryFn: () =>
        getXvsVaultPendingReward({
          xvsVaultContract,
          tokenAddress: xvsTokenAddress,
          poolIndex,
          accountAddress: accountAddress || '',
        }),
      queryKey: [FunctionKey.GET_XVS_VAULT_PENDING_REWARD, xvsTokenAddress, poolIndex],
      enabled: !!accountAddress,
    });

    poolQueries.push({
      queryFn: () =>
        getXvsVaultUserInfo({
          xvsVaultContract,
          tokenAddress: xvsTokenAddress,
          poolIndex,
          accountAddress: accountAddress || '',
        }),
      queryKey: [FunctionKey.GET_XVS_VAULT_USER_INFO, xvsTokenAddress, poolIndex],
      enabled: !!accountAddress,
    });
  }

  const poolQueryResults = useQueries(poolQueries);

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

  // Query total amount of tokens staked for each pool
  const poolBalanceQueries: UseQueryOptions<GetBalanceOfOutput>[] = [];

  // Fetch pool balances
  for (let poolIndex = 0; poolIndex < xvsVaultPoolsCount; poolIndex++) {
    const tokenAddress = stakedTokenAddresses[poolIndex];
    const tokenContract = tokenAddress && getTokenContractByAddress(tokenAddress, web3);

    poolBalanceQueries.push({
      queryFn: () =>
        getBalanceOf({
          tokenContract: tokenContract || ({} as Bep20),
          accountAddress: xvsVaultContract.options.address,
        }),
      queryKey: [FunctionKey.GET_XVS_VAULT_POOL_INFOS, xvsTokenAddress, poolIndex],
      enabled: !!tokenContract,
    });
  }

  const poolBalanceQueryResults = useQueries(poolQueries);

  console.log('poolQueryResults', poolQueryResults);
  console.log('poolBalanceQueryResults', poolBalanceQueryResults);

  const arePoolQueriesLoading = poolQueryResults.some(queryResult => queryResult.isLoading);
  const arePoolBalanceQueriesLoading = poolBalanceQueryResults.some(
    queryResult => queryResult.isLoading,
  );
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
