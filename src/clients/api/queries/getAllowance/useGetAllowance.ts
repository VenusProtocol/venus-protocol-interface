import { QueryObserverOptions, useQuery } from 'react-query';
import { Token } from 'types';
import { callOrThrow } from 'utilities';

import getAllowance, {
  GetAllowanceInput,
  GetAllowanceOutput,
} from 'clients/api/queries/getAllowance';
import FunctionKey from 'constants/functionKey';
import useGetTokenContract from 'hooks/useGetTokenContract';

export type UseGetAllowanceQueryKey = [
  FunctionKey.GET_TOKEN_ALLOWANCE,
  {
    tokenAddress: string;
    spenderAddress: string;
    accountAddress: string;
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
  const tokenContract = useGetTokenContract({ token });
  const queryKey: UseGetAllowanceQueryKey = [
    FunctionKey.GET_TOKEN_ALLOWANCE,
    {
      tokenAddress: token.address,
      spenderAddress,
      accountAddress,
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
