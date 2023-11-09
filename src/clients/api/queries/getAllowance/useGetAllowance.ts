import { useGetTokenContract } from 'packages/contracts';
import { QueryObserverOptions, useQuery } from 'react-query';
import { ChainId, Token } from 'types';
import { callOrThrow } from 'utilities';

import getAllowance, {
  GetAllowanceInput,
  GetAllowanceOutput,
} from 'clients/api/queries/getAllowance';
import FunctionKey from 'constants/functionKey';
import { useAuth } from 'context/AuthContext';

export type UseGetAllowanceQueryKey = [
  FunctionKey.GET_TOKEN_ALLOWANCE,
  {
    chainId: ChainId;
    accountAddress: string;
    tokenAddress: string;
    spenderAddress: string;
  },
];

type Options = QueryObserverOptions<
  GetAllowanceOutput,
  Error,
  GetAllowanceOutput,
  GetAllowanceOutput,
  UseGetAllowanceQueryKey
>;

type TrimmedGetAllowanceInput = Omit<GetAllowanceInput, 'tokenContract'> & { token: Token };

const useGetAllowance = (
  { token, spenderAddress, accountAddress }: TrimmedGetAllowanceInput,
  options?: Options,
) => {
  const { chainId } = useAuth();
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
