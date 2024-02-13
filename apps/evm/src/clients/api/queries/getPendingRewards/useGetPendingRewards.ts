import { useMemo } from 'react';
import { QueryObserverOptions, useQuery } from 'react-query';

import FunctionKey from 'constants/functionKey';
import { useIsFeatureEnabled } from 'hooks/useIsFeatureEnabled';
import {
  useGetLegacyPoolComptrollerContractAddress,
  useGetPoolLensContract,
  useGetPrimeContract,
  useGetResilientOracleContract,
  useGetVaiVaultContract,
  useGetVenusLensContract,
  useGetXvsVaultContract,
} from 'libs/contracts';
import { useGetTokens } from 'libs/tokens';
import { useChainId } from 'libs/wallet';
import { ChainId } from 'types';
import { callOrThrow, generatePseudoRandomRefetchInterval } from 'utilities';

import getPendingRewards from '.';
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
  | 'legacyPoolComptrollerContractAddress'
  | 'isolatedPoolComptrollerAddresses'
  | 'xvsVestingVaultPoolCount'
  | 'xvsTokenAddress'
  | 'tokens'
>;

export type UseGetPendingRewardsQueryKey = [
  FunctionKey.GET_PENDING_REWARDS,
  TrimmedGetPendingRewardsInput & {
    chainId: ChainId;
  },
];

type Options = QueryObserverOptions<
  GetPendingRewardsOutput,
  Error,
  GetPendingRewardsOutput,
  GetPendingRewardsOutput,
  UseGetPendingRewardsQueryKey
>;

const refetchInterval = generatePseudoRandomRefetchInterval();

const useGetPendingRewards = (input: TrimmedGetPendingRewardsInput, options?: Options) => {
  const { chainId } = useChainId();
  const legacyPoolComptrollerContractAddress = useGetLegacyPoolComptrollerContractAddress();
  const resilientOracleContract = useGetResilientOracleContract();
  const venusLensContract = useGetVenusLensContract();
  const poolLensContract = useGetPoolLensContract();
  const vaiVaultContract = useGetVaiVaultContract();
  const xvsVaultContract = useGetXvsVaultContract();
  const primeContract = useGetPrimeContract();

  const isPrimeEnabled = useIsFeatureEnabled({
    name: 'prime',
  });

  const tokens = useGetTokens();

  // Get Comptroller addresses of isolated pools
  const { data: getPoolsData, isLoading: isGetPoolsLoading } = useGetPools({
    accountAddress: input.accountAddress || undefined,
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
    useGetXvsVaultPoolCount({
      enabled: options?.enabled,
    });
  const xvsVestingVaultPoolCount = getXvsVaultPoolCountData?.poolCount || 0;

  // Sort addresses to output the same data when providing them in a different
  // order. This prevents unnecessary queries
  const sortedIsolatedPoolComptrollerAddresses = [...isolatedPoolComptrollerAddresses].sort();

  return useQuery(
    [FunctionKey.GET_PENDING_REWARDS, { ...input, chainId }],
    () =>
      callOrThrow(
        {
          resilientOracleContract,
          poolLensContract,
          xvsVaultContract,
        },
        params =>
          getPendingRewards({
            legacyPoolComptrollerContractAddress,
            venusLensContract,
            isolatedPoolComptrollerAddresses: sortedIsolatedPoolComptrollerAddresses,
            xvsVestingVaultPoolCount,
            vaiVaultContract,
            tokens,
            primeContract: isPrimeEnabled ? primeContract : undefined,
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
