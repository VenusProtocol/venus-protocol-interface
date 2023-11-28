import { QueryObserverOptions, useQuery } from 'react-query';

import getVTokenBalancesAll, {
  GetVTokenBalancesAllInput,
  GetVTokenBalancesAllOutput,
} from 'clients/api/queries/getVTokenBalancesAll';
import FunctionKey from 'constants/functionKey';
import { useGetVenusLensContract } from 'packages/contracts';
import { useChainId } from 'packages/wallet';
import { ChainId } from 'types';
import { callOrThrow } from 'utilities';

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
  const { chainId } = useChainId();
  const venusLensContract = useGetVenusLensContract();

  return useQuery(
    [FunctionKey.GET_V_TOKEN_BALANCES_ALL, { ...input, chainId }],
    () =>
      callOrThrow({ venusLensContract }, params => getVTokenBalancesAll({ ...params, ...input })),
    options,
  );
};

export default useGetVTokenBalancesAll;
