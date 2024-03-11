import { type QueryObserverOptions, useQuery } from 'react-query';

import getVTokenBalancesAll, {
  type GetVTokenBalancesAllInput,
  type GetVTokenBalancesAllOutput,
} from 'clients/api/queries/getVTokenBalancesAll';
import FunctionKey from 'constants/functionKey';
import { useGetPoolLensContract } from 'libs/contracts';
import { useChainId } from 'libs/wallet';
import type { ChainId } from 'types';
import { callOrThrow } from 'utilities';

type TrimmedGetVTokenBalancesAllInput = Omit<GetVTokenBalancesAllInput, 'poolLensContract'>;

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
  const poolLensContract = useGetPoolLensContract();

  return useQuery(
    [FunctionKey.GET_V_TOKEN_BALANCES_ALL, { ...input, chainId }],
    () =>
      callOrThrow({ poolLensContract }, params => getVTokenBalancesAll({ ...params, ...input })),
    options,
  );
};

export default useGetVTokenBalancesAll;
