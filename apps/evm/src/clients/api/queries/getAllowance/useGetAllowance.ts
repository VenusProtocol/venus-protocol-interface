import { type QueryObserverOptions, useQuery } from '@tanstack/react-query';

import getAllowance, {
  type GetAllowanceInput,
  type GetAllowanceOutput,
} from 'clients/api/queries/getAllowance';
import FunctionKey from 'constants/functionKey';
import { useChainId, usePublicClient } from 'libs/wallet';
import type { ChainId, Token } from 'types';
import type { Address } from 'viem';

type TrimmedGetAllowanceInput = Omit<GetAllowanceInput, 'publicClient'> & {
  token: Token;
};

export type UseGetAllowanceQueryKey = [
  FunctionKey.GET_TOKEN_ALLOWANCE,
  Omit<TrimmedGetAllowanceInput, 'token'> & {
    chainId: ChainId;
    tokenAddress: Address;
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
  const { publicClient } = usePublicClient();

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
      getAllowance({
        publicClient,
        spenderAddress,
        accountAddress,
        token,
      }),
    ...options,
  });
};

export default useGetAllowance;
