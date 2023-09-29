import {
  useGetMainPoolComptrollerContractAddress,
  useGetPoolLensContract,
  useGetResilientOracleContract,
  useGetVaiVaultContract,
  useGetVenusLensContract,
  useGetXvsVaultContract,
} from 'packages/contractsNew';
import { useGetTokens } from 'packages/tokens';
import { useMemo } from 'react';
import { QueryObserverOptions, useQuery } from 'react-query';
import { callOrThrow, generatePseudoRandomRefetchInterval } from 'utilities';

import FunctionKey from 'constants/functionKey';

import getPendingRewardGroups from '.';
import useGetXvsVaultPoolCount from '../getXvsVaultPoolCount/useGetXvsVaultPoolCount';
import useGetPools from '../useGetPools';
import { GetPendingRewardsInput, GetPendingRewardsOutput } from './types';

type TrimmedGetPendingRewardsInput = Omit<
  GetPendingRewardsInput,
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
  GetPendingRewardsOutput,
  Error,
  GetPendingRewardsOutput,
  GetPendingRewardsOutput,
  [FunctionKey.GET_PENDING_REWARDS, TrimmedGetPendingRewardsInput]
>;

const refetchInterval = generatePseudoRandomRefetchInterval();

const useGetPendingRewards = (input: TrimmedGetPendingRewardsInput, options?: Options) => {
  const mainPoolComptrollerContractAddress = useGetMainPoolComptrollerContractAddress();
  const resilientOracleContract = useGetResilientOracleContract();
  const venusLensContract = useGetVenusLensContract();
  const poolLensContract = useGetPoolLensContract();
  const vaiVaultContract = useGetVaiVaultContract();
  const xvsVaultContract = useGetXvsVaultContract();

  const tokens = useGetTokens();

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
      refetchInterval,
      ...options,
      enabled:
        (!options || options.enabled) && !isGetPoolsLoading && !isGetXvsVaultPoolCountLoading,
    },
  );
};

export default useGetPendingRewards;
