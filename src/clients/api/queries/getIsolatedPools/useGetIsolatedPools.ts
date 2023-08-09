import { QueryObserverOptions, useQuery } from 'react-query';
import { callOrThrow } from 'utilities';

import getIsolatedPools, {
  GetIsolatedPoolsInput,
  GetIsolatedPoolsOutput,
} from 'clients/api/queries/getIsolatedPools';
import { useGetUniqueContract } from 'clients/contracts';
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
  const { provider } = useAuth();
  const multicall = useMulticall();

  const poolLensContract = useGetUniqueContract({
    name: 'poolLens',
  });

  return useQuery(
    [FunctionKey.GET_ISOLATED_POOLS, input],
    () =>
      callOrThrow({ poolLensContract }, params =>
        getIsolatedPools({
          multicall,
          provider,
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
