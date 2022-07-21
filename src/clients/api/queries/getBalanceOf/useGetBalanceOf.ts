import { QueryObserverOptions, useQuery } from 'react-query';
import { TokenId } from 'types';

import { GetBalanceOfInput, GetBalanceOfOutput, getBalanceOf } from 'clients/api';
import { useTokenContract } from 'clients/contracts/hooks';
import FunctionKey from 'constants/functionKey';

type Options = QueryObserverOptions<
  GetBalanceOfOutput,
  Error,
  GetBalanceOfOutput,
  GetBalanceOfOutput,
  [FunctionKey.GET_BALANCE_OF, string, string]
>;

const useGetBalanceOf = (
  { accountAddress, tokenId }: Omit<GetBalanceOfInput, 'tokenContract'> & { tokenId: TokenId },
  options?: Options,
) => {
  const tokenContract = useTokenContract(tokenId);

  return useQuery(
    [FunctionKey.GET_BALANCE_OF, accountAddress, tokenId],
    () => getBalanceOf({ tokenContract, accountAddress }),
    options,
  );
};

export default useGetBalanceOf;
