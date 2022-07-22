import { QueryObserverOptions, useQuery } from 'react-query';
import { TokenId } from 'types';

import getAllowance, {
  GetAllowanceInput,
  GetAllowanceOutput,
} from 'clients/api/queries/getAllowance';
import { useTokenContract } from 'clients/contracts/hooks';
import FunctionKey from 'constants/functionKey';

export type UseGetAllowanceQueryKey = [
  FunctionKey.GET_TOKEN_ALLOWANCE,
  {
    tokenId: TokenId;
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
    tokenId,
    spenderAddress,
    accountAddress,
  }: Omit<GetAllowanceInput, 'tokenContract'> & { tokenId: TokenId },
  options?: Options,
) => {
  const tokenContract = useTokenContract(tokenId);

  return useQuery(
    [
      FunctionKey.GET_TOKEN_ALLOWANCE,
      {
        tokenId,
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
