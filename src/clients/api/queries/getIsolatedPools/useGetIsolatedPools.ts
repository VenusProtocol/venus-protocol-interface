import { QueryObserverOptions, useQuery } from 'react-query';
import { callOrThrow } from 'utilities';

import getIsolatedPools, {
  GetIsolatedPoolsInput,
  GetIsolatedPoolsOutput,
} from 'clients/api/queries/getIsolatedPools';
import { DEFAULT_REFETCH_INTERVAL_MS } from 'constants/defaultRefetchInterval';
import FunctionKey from 'constants/functionKey';
import { useAuth } from 'context/AuthContext';
import useGetTokens from 'hooks/useGetTokens';
import useGetUniqueContract from 'hooks/useGetUniqueContract';
import useGetUniqueContractAddress from 'hooks/useGetUniqueContractAddress';

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

const useGetIsolatedPools = (input: TrimmedInput, options?: Options) => {
  const { provider } = useAuth();
  const tokens = useGetTokens();

  const poolLensContract = useGetUniqueContract({
    name: 'poolLens',
  });

  const resilientOracleContract = useGetUniqueContract({
    name: 'resilientOracle',
  });

  const poolRegistryContractAddress = useGetUniqueContractAddress({
    name: 'poolRegistry',
  });

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
      refetchInterval: DEFAULT_REFETCH_INTERVAL_MS,
      ...options,
    },
  );
};

export default useGetIsolatedPools;
