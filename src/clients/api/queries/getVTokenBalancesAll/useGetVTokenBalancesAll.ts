import { QueryObserverOptions, useQuery } from 'react-query';
import { callOrThrow } from 'utilities';

import getVTokenBalancesAll, {
  GetVTokenBalancesAllInput,
  GetVTokenBalancesAllOutput,
} from 'clients/api/queries/getVTokenBalancesAll';
import { DEFAULT_REFETCH_INTERVAL_MS } from 'constants/defaultRefetchInterval';
import FunctionKey from 'constants/functionKey';
import useGetUniqueContract from 'hooks/useGetUniqueContract';

type TrimmedGetVTokenBalancesAllInput = Omit<GetVTokenBalancesAllInput, 'venusLensContract'>;
type Options = QueryObserverOptions<
  GetVTokenBalancesAllOutput,
  Error,
  GetVTokenBalancesAllOutput,
  GetVTokenBalancesAllOutput,
  [FunctionKey.GET_V_TOKEN_BALANCES_ALL, TrimmedGetVTokenBalancesAllInput]
>;

const useGetVTokenBalancesAll = (input: TrimmedGetVTokenBalancesAllInput, options?: Options) => {
  const venusLensContract = useGetUniqueContract({
    name: 'venusLens',
  });

  return useQuery(
    [FunctionKey.GET_V_TOKEN_BALANCES_ALL, input],
    () =>
      callOrThrow({ venusLensContract }, params => getVTokenBalancesAll({ ...params, ...input })),
    {
      refetchInterval: DEFAULT_REFETCH_INTERVAL_MS,
      ...options,
    },
  );
};

export default useGetVTokenBalancesAll;
