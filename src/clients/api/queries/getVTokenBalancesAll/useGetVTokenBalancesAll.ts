import { useGetVenusLensContract } from 'packages/contracts';
import { QueryObserverOptions, useQuery } from 'react-query';
import { ChainId } from 'types';
import { callOrThrow } from 'utilities';

import getVTokenBalancesAll, {
  GetVTokenBalancesAllInput,
  GetVTokenBalancesAllOutput,
} from 'clients/api/queries/getVTokenBalancesAll';
import FunctionKey from 'constants/functionKey';
import { useAuth } from 'context/AuthContext';

type TrimmedGetVTokenBalancesAllInput = Omit<GetVTokenBalancesAllInput, 'venusLensContract'>;

export type UseGetVTokenBalancesAllQueryKey = [
  FunctionKey.GET_V_TOKEN_BALANCES_ALL,
  TrimmedGetVTokenBalancesAllInput & {
    chainId: ChainId;
  },
];

type Options = QueryObserverOptions<
  GetVTokenBalancesAllOutput,
  Error,
  GetVTokenBalancesAllOutput,
  GetVTokenBalancesAllOutput,
  UseGetVTokenBalancesAllQueryKey
>;

const useGetVTokenBalancesAll = (input: TrimmedGetVTokenBalancesAllInput, options?: Options) => {
  const { chainId } = useAuth();
  const venusLensContract = useGetVenusLensContract();

  return useQuery(
    [FunctionKey.GET_V_TOKEN_BALANCES_ALL, { ...input, chainId }],
    () =>
      callOrThrow({ venusLensContract }, params => getVTokenBalancesAll({ ...params, ...input })),
    options,
  );
};

export default useGetVTokenBalancesAll;
