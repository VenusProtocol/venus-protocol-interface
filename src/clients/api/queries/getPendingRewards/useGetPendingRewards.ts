import { useMemo } from 'react';
import { QueryObserverOptions, useQuery } from 'react-query';
import { callOrThrow } from 'utilities';

import { DEFAULT_REFETCH_INTERVAL_MS } from 'constants/defaultRefetchInterval';
import FunctionKey from 'constants/functionKey';
import useGetTokens from 'hooks/useGetTokens';
import useGetUniqueContract from 'hooks/useGetUniqueContract';
import useGetUniqueContractAddress from 'hooks/useGetUniqueContractAddress';

import getPendingRewardGroups from '.';
import useGetXvsVaultPoolCount from '../getXvsVaultPoolCount/useGetXvsVaultPoolCount';
import useGetPools from '../useGetPools';
import { GetPendingRewardGroupsInput, GetPendingRewardGroupsOutput } from './types';

type TrimmedGetPendingRewardGroupsInput = Omit<
  GetPendingRewardGroupsInput,
  | 'venusLensContract'
  | 'poolLensContract'
  | 'vaiVaultContract'
  | 'xvsVaultContract'
  | 'resilientOracleContract'
  | 'mainPoolComptrollerContractAddress'
  | 'isolatedPoolComptrollerAddresses'
  | 'xvsVestingVaultPoolCount'
  | 'xvsTokenAddress'
  | 'tokens'
>;

type Options = QueryObserverOptions<
  GetPendingRewardGroupsOutput,
  Error,
  GetPendingRewardGroupsOutput,
  GetPendingRewardGroupsOutput,
  [FunctionKey.GET_PENDING_REWARDS, TrimmedGetPendingRewardGroupsInput]
>;

const useGetPendingRewards = (input: TrimmedGetPendingRewardGroupsInput, options?: Options) => {
  const mainPoolComptrollerContractAddress = useGetUniqueContractAddress({
    name: 'mainPoolComptroller',
  });

  const resilientOracleContract = useGetUniqueContract({
    name: 'resilientOracle',
  });

  const venusLensContract = useGetUniqueContract({
    name: 'venusLens',
  });

  const poolLensContract = useGetUniqueContract({
    name: 'poolLens',
  });

  const vaiVaultContract = useGetUniqueContract({
    name: 'vaiVault',
  });

  const xvsVaultContract = useGetUniqueContract({
    name: 'xvsVault',
  });

  const tokens = useGetTokens();
  const xvsTokenAddress = tokens.find(token => token.symbol === 'XVS')?.address;

  // Get Comptroller addresses of isolated pools
  const { data: getPoolsData, isLoading: isGetPoolsLoading } = useGetPools({
    accountAddress: input.accountAddress,
  });

  const isolatedPoolComptrollerAddresses = useMemo(
    () =>
      (getPoolsData?.pools || []).reduce<string[]>(
        (acc, pool) => (pool.isIsolated ? [...acc, pool.comptrollerAddress] : acc),
        [],
      ),
    [getPoolsData?.pools],
  );

  // Get XVS vesting vault pool count
  const { data: getXvsVaultPoolCountData, isLoading: isGetXvsVaultPoolCountLoading } =
    useGetXvsVaultPoolCount();
  const xvsVestingVaultPoolCount = getXvsVaultPoolCountData?.poolCount || 0;

  // Sort addresses to output the same data when providing them in a different
  // order. This prevents unnecessary queries
  const sortedIsolatedPoolComptrollerAddresses = [...isolatedPoolComptrollerAddresses].sort();

  return useQuery(
    [FunctionKey.GET_PENDING_REWARDS, input],
    () =>
      callOrThrow(
        {
          resilientOracleContract,
          poolLensContract,
          vaiVaultContract,
          xvsVaultContract,
          xvsTokenAddress,
        },
        params =>
          getPendingRewardGroups({
            mainPoolComptrollerContractAddress,
            venusLensContract,
            isolatedPoolComptrollerAddresses: sortedIsolatedPoolComptrollerAddresses,
            xvsVestingVaultPoolCount,
            tokens,
            ...input,
            ...params,
          }),
      ),
    {
      refetchInterval: DEFAULT_REFETCH_INTERVAL_MS,
      ...options,
      enabled:
        (!options || options.enabled) && !isGetPoolsLoading && !isGetXvsVaultPoolCountLoading,
    },
  );
};

export default useGetPendingRewards;
