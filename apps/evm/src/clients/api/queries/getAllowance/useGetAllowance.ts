import { QueryObserverOptions, useQuery } from 'react-query';

import getAllowance, {
  GetAllowanceInput,
  GetAllowanceOutput,
} from 'clients/api/queries/getAllowance';
import FunctionKey from 'constants/functionKey';
import { useGetTokenContract } from 'libs/contracts';
import { useChainId } from 'libs/wallet';
import { ChainId, Token } from 'types';
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
  options?: Options,
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

  return useQuery(
    queryKey,
    () =>
      callOrThrow({ tokenContract }, params =>
        getAllowance({
          spenderAddress,
          accountAddress,
          ...params,
        }),
      ),
    options,
  );
};

export default useGetAllowance;
