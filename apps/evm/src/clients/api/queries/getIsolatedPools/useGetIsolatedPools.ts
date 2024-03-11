import { type QueryObserverOptions, useQuery } from 'react-query';

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
  useGetResilientOracleContract,
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
  | 'poolRegistryContractAddress'
  | 'resilientOracleContract'
  | 'tokens'
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

const useGetIsolatedPools = (input: TrimmedInput, options?: Options) => {
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
  const resilientOracleContract = useGetResilientOracleContract();
  const poolRegistryContractAddress = useGetPoolRegistryContractAddress();

  return useQuery(
    [FunctionKey.GET_ISOLATED_POOLS, { ...input, chainId }],
    () =>
      callOrThrow(
        { chainId, poolLensContract, poolRegistryContractAddress, resilientOracleContract, xvs },
        params =>
          getIsolatedPools({
            provider,
            tokens,
            blocksPerDay,
            primeContract: isPrimeEnabled ? primeContract : undefined,
            ...input,
            ...params,
          }),
      ),
    {
      refetchInterval,
      ...options,
    },
  );
};

export default useGetIsolatedPools;
