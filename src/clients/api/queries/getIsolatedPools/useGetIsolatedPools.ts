import { QueryObserverOptions, useQuery } from 'react-query';

import getIsolatedPools, {
  GetIsolatedPoolsInput,
  GetIsolatedPoolsOutput,
} from 'clients/api/queries/getIsolatedPools';
import { useGetPoolLensContract } from 'clients/contracts';
import { useMulticall } from 'clients/web3';
import { DEFAULT_REFETCH_INTERVAL_MS } from 'constants/defaultRefetchInterval';
import FunctionKey from 'constants/functionKey';
import { useAuth } from 'context/AuthContext';

type TrimmedInput = Omit<GetIsolatedPoolsInput, 'multicall' | 'provider' | 'poolLensContract'>;

type Options = QueryObserverOptions<
  GetIsolatedPoolsOutput,
  Error,
  GetIsolatedPoolsOutput,
  GetIsolatedPoolsOutput,
  [FunctionKey.GET_ISOLATED_POOLS, TrimmedInput]
>;

const useGetIsolatedPools = (input: TrimmedInput, options?: Options) => {
  const multicall = useMulticall();
  const poolLensContract = useGetPoolLensContract();
  const { provider } = useAuth();

  return useQuery(
    [FunctionKey.GET_ISOLATED_POOLS, input],
    () =>
      getIsolatedPools({
        ...input,
        multicall,
        poolLensContract,
        provider,
      }),
    {
      refetchInterval: DEFAULT_REFETCH_INTERVAL_MS,
      ...options,
    },
  );
};

export default useGetIsolatedPools;
