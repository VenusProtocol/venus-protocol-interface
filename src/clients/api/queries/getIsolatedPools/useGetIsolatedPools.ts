import { QueryObserverOptions, useQuery } from 'react-query';
import { callOrThrow } from 'utilities';

import getIsolatedPools, {
  GetIsolatedPoolsInput,
  GetIsolatedPoolsOutput,
} from 'clients/api/queries/getIsolatedPools';
import { useMulticall3 } from 'clients/web3';
import { DEFAULT_REFETCH_INTERVAL_MS } from 'constants/defaultRefetchInterval';
import FunctionKey from 'constants/functionKey';
import { useAuth } from 'context/AuthContext';
import useGetTokens from 'hooks/useGetTokens';
import useGetUniqueContract from 'hooks/useGetUniqueContract';
import useGetUniqueContractAddress from 'hooks/useGetUniqueContractAddress';

type TrimmedInput = Omit<
  GetIsolatedPoolsInput,
  | 'multicall3'
  | 'provider'
  | 'poolLensContract'
  | 'poolRegistryContractAddress'
  | 'resilientOracleContractAddress'
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
  const multicall3 = useMulticall3();
  const tokens = useGetTokens();

  const poolLensContract = useGetUniqueContract({
    name: 'poolLens',
  });

  const poolRegistryContractAddress = useGetUniqueContractAddress({
    name: 'poolRegistry',
  });

  const resilientOracleContractAddress = useGetUniqueContractAddress({
    name: 'resilientOracle',
  });

  return useQuery(
    [FunctionKey.GET_ISOLATED_POOLS, input],
    () =>
      callOrThrow(
        { poolLensContract, poolRegistryContractAddress, resilientOracleContractAddress },
        params =>
          getIsolatedPools({
            multicall3,
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
