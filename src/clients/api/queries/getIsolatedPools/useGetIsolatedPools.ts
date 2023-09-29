import {
  useGetPoolLensContract,
  useGetPoolRegistryContractAddress,
  useGetResilientOracleContract,
} from 'packages/contractsNew';
import { useGetTokens } from 'packages/tokens';
import { QueryObserverOptions, useQuery } from 'react-query';
import { callOrThrow, generatePseudoRandomRefetchInterval } from 'utilities';

import getIsolatedPools, {
  GetIsolatedPoolsInput,
  GetIsolatedPoolsOutput,
} from 'clients/api/queries/getIsolatedPools';
import FunctionKey from 'constants/functionKey';
import { useAuth } from 'context/AuthContext';

type TrimmedInput = Omit<
  GetIsolatedPoolsInput,
  | 'provider'
  | 'poolLensContract'
  | 'poolRegistryContractAddress'
  | 'resilientOracleContract'
  | 'tokens'
>;

type Options = QueryObserverOptions<
  GetIsolatedPoolsOutput,
  Error,
  GetIsolatedPoolsOutput,
  GetIsolatedPoolsOutput,
  [FunctionKey.GET_ISOLATED_POOLS, TrimmedInput]
>;

const refetchInterval = generatePseudoRandomRefetchInterval();

const useGetIsolatedPools = (input: TrimmedInput, options?: Options) => {
  const { provider } = useAuth();
  const tokens = useGetTokens();

  const poolLensContract = useGetPoolLensContract();
  const resilientOracleContract = useGetResilientOracleContract();
  const poolRegistryContractAddress = useGetPoolRegistryContractAddress();

  return useQuery(
    [FunctionKey.GET_ISOLATED_POOLS, input],
    () =>
      callOrThrow(
        { poolLensContract, poolRegistryContractAddress, resilientOracleContract },
        params =>
          getIsolatedPools({
            provider,
            tokens,
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
