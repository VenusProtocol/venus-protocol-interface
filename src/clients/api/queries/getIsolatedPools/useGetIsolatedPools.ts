import { QueryObserverOptions, useQuery } from 'react-query';

import getIsolatedPools, {
  GetIsolatedPoolsInput,
  GetIsolatedPoolsOutput,
} from 'clients/api/queries/getIsolatedPools';
import FunctionKey from 'constants/functionKey';

type Options = QueryObserverOptions<
  GetIsolatedPoolsOutput,
  Error,
  GetIsolatedPoolsOutput,
  GetIsolatedPoolsOutput,
  [FunctionKey.GET_ISOLATED_POOLS, GetIsolatedPoolsInput]
>;

const useGetIsolatedPools = (input: GetIsolatedPoolsInput, options?: Options) =>
  useQuery([FunctionKey.GET_ISOLATED_POOLS, input], () => getIsolatedPools(input), options);

export default useGetIsolatedPools;
