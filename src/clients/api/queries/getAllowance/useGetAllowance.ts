import { QueryObserverOptions, useQuery } from 'react-query';
import { Token } from 'types';

import getAllowance, {
  GetAllowanceInput,
  GetAllowanceOutput,
} from 'clients/api/queries/getAllowance';
import { useTokenContract } from 'clients/contracts/hooks';
import FunctionKey from 'constants/functionKey';

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

const useGetAllowance = (
  {
    token,
    spenderAddress,
    accountAddress,
  }: Omit<GetAllowanceInput, 'tokenContract'> & { token: Token },
  options?: Options,
) => {
  const tokenContract = useTokenContract(token);

  return useQuery(
    [
      FunctionKey.GET_TOKEN_ALLOWANCE,
      {
        tokenAddress: token.address,
        spenderAddress,
        accountAddress,
      },
    ],
    () =>
      getAllowance({
        tokenContract,
        spenderAddress,
        accountAddress,
      }),
    options,
  );
};

export default useGetAllowance;
