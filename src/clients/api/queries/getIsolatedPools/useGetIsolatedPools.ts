import {
  useGetPoolLensContract,
  useGetPoolRegistryContractAddress,
  useGetResilientOracleContract,
} from 'packages/contracts';
import { useGetTokens } from 'packages/tokens';
import { QueryObserverOptions, useQuery } from 'react-query';
import { ChainId } from 'types';
import { callOrThrow, generatePseudoRandomRefetchInterval } from 'utilities';

import getIsolatedPools, {
  GetIsolatedPoolsInput,
  GetIsolatedPoolsOutput,
} from 'clients/api/queries/getIsolatedPools';
import { CHAIN_METADATA } from 'constants/chainMetadata';
import FunctionKey from 'constants/functionKey';
import { useAuth } from 'context/AuthContext';

type TrimmedInput = Omit<
  GetIsolatedPoolsInput,
  | 'blocksPerDay'
  | 'provider'
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
  const { provider, chainId } = useAuth();
  const { blocksPerDay } = CHAIN_METADATA[chainId];

  const tokens = useGetTokens();

  const poolLensContract = useGetPoolLensContract();
  const resilientOracleContract = useGetResilientOracleContract();
  const poolRegistryContractAddress = useGetPoolRegistryContractAddress();

  return useQuery(
    [FunctionKey.GET_ISOLATED_POOLS, { ...input, chainId }],
    () =>
      callOrThrow(
        { poolLensContract, poolRegistryContractAddress, resilientOracleContract },
        params =>
          getIsolatedPools({
            provider,
            tokens,
            blocksPerDay,
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
