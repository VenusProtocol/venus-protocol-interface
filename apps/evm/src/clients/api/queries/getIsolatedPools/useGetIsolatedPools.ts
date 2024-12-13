import { type QueryObserverOptions, useQuery } from '@tanstack/react-query';

import { useGetApiPools } from 'clients/api';
import getIsolatedPools, {
  type GetIsolatedPoolsInput,
  type GetIsolatedPoolsOutput,
} from 'clients/api/queries/getIsolatedPools';
import FunctionKey from 'constants/functionKey';
import { useGetChainMetadata } from 'hooks/useGetChainMetadata';
import { useIsFeatureEnabled } from 'hooks/useIsFeatureEnabled';
import {
  useGetPoolLensContract,
  useGetPoolRegistryContractAddress,
  useGetPrimeContract,
} from 'libs/contracts';
import { useGetToken, useGetTokens } from 'libs/tokens';
import { useChainId, useProvider } from 'libs/wallet';
import type { ChainId } from 'types';
import { callOrThrow, generatePseudoRandomRefetchInterval } from 'utilities';

type TrimmedInput = Omit<
  GetIsolatedPoolsInput,
  | 'chainId'
  | 'xvs'
  | 'blocksPerDay'
  | 'provider'
  | 'primeContract'
  | 'poolLensContract'
  | 'vTreasuryContractAddress'
  | 'poolRegistryContractAddress'
  | 'resilientOracleContract'
  | 'tokens'
  | 'isolatedPoolsData'
>;

export type UseGetIsolatedPoolsQueryKey = [
  FunctionKey.GET_ISOLATED_POOLS,
  TrimmedInput & {
    chainId: ChainId;
  },
];

type Options = QueryObserverOptions<
  GetIsolatedPoolsOutput,
  Error,
  GetIsolatedPoolsOutput,
  GetIsolatedPoolsOutput,
  UseGetIsolatedPoolsQueryKey
>;

const refetchInterval = generatePseudoRandomRefetchInterval();

const useGetIsolatedPools = (input?: TrimmedInput, options?: Options) => {
  const { data: apiPoolsData } = useGetApiPools();
  const { provider } = useProvider();
  const { chainId } = useChainId();
  const { blocksPerDay } = useGetChainMetadata();

  const tokens = useGetTokens();
  const xvs = useGetToken({ symbol: 'XVS' });
  const isPrimeEnabled = useIsFeatureEnabled({
    name: 'prime',
  });

  const poolLensContract = useGetPoolLensContract();
  const primeContract = useGetPrimeContract();
  const poolRegistryContractAddress = useGetPoolRegistryContractAddress();

  const isQueryEnabled =
    apiPoolsData !== undefined && (options?.enabled === undefined || options?.enabled);

  return useQuery({
    queryKey: [FunctionKey.GET_ISOLATED_POOLS, { ...input, chainId }],

    queryFn: () =>
      callOrThrow(
        {
          chainId,
          poolLensContract,
          poolRegistryContractAddress,
          xvs,
        },
        params =>
          getIsolatedPools({
            isolatedPoolsData: { pools: apiPoolsData!.pools.filter(p => p.isIsolated) },
            provider,
            tokens,
            blocksPerDay,
            primeContract: isPrimeEnabled ? primeContract : undefined,
            ...input,
            ...params,
          }),
      ),

    refetchInterval,
    ...options,
    enabled: isQueryEnabled,
  });
};

export default useGetIsolatedPools;
