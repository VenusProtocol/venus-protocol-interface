import { QueryObserverOptions, useQuery } from 'react-query';

import getIsolatedPools, {
  GetIsolatedPoolsInput,
  GetIsolatedPoolsOutput,
} from 'clients/api/queries/getIsolatedPools';
import { useMulticall } from 'clients/web3';
import FunctionKey from 'constants/functionKey';
import { useAuth } from 'context/AuthContext';

type TrimmedInput = Omit<GetIsolatedPoolsInput, 'multicall' | 'provider'>;

type Options = QueryObserverOptions<
  GetIsolatedPoolsOutput,
  Error,
  GetIsolatedPoolsOutput,
  GetIsolatedPoolsOutput,
  [FunctionKey.GET_ISOLATED_POOLS, TrimmedInput]
>;

const useGetIsolatedPools = (input: TrimmedInput, options?: Options) => {
  const multicall = useMulticall();
  const { provider } = useAuth();

  return useQuery(
    [FunctionKey.GET_ISOLATED_POOLS, input],
    () =>
      getIsolatedPools({
        ...input,
        multicall,
        provider,
      }),
    options,
  );
};

export default useGetIsolatedPools;
