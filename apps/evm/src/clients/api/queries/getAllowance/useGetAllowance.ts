import { type QueryObserverOptions, useQuery } from '@tanstack/react-query';

import type { ChainId } from '@venusprotocol/chains';
import getAllowance, {
  type GetAllowanceInput,
  type GetAllowanceOutput,
} from 'clients/api/queries/getAllowance';
import FunctionKey from 'constants/functionKey';
import { useGetTokenContract } from 'libs/contracts';
import { useChainId } from 'libs/wallet';
import type { Token } from 'types';
import { callOrThrow } from 'utilities';

type TrimmedGetAllowanceInput = Omit<GetAllowanceInput, 'tokenContract'> & { token: Token };

export type UseGetAllowanceQueryKey = [
  FunctionKey.GET_TOKEN_ALLOWANCE,
  Omit<TrimmedGetAllowanceInput, 'token'> & {
    chainId: ChainId;
    tokenAddress: string;
  },
];

type Options = QueryObserverOptions<
  GetAllowanceOutput,
  Error,
  GetAllowanceOutput,
  GetAllowanceOutput,
  UseGetAllowanceQueryKey
>;

const useGetAllowance = (
  { token, spenderAddress, accountAddress }: TrimmedGetAllowanceInput,
  options?: Partial<Options>,
) => {
  const { chainId } = useChainId();
  const tokenContract = useGetTokenContract({ token });

  const queryKey: UseGetAllowanceQueryKey = [
    FunctionKey.GET_TOKEN_ALLOWANCE,
    {
      chainId,
      accountAddress,
      tokenAddress: token.address,
      spenderAddress,
    },
  ];

  return useQuery({
    queryKey: queryKey,

    queryFn: () =>
      callOrThrow({ tokenContract }, params =>
        getAllowance({
          spenderAddress,
          accountAddress,
          ...params,
        }),
      ),

    ...options,
  });
};

export default useGetAllowance;
