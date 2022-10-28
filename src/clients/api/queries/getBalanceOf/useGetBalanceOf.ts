import { QueryObserverOptions, useQuery } from 'react-query';
import { TokenId } from 'types';

import { GetBalanceOfInput, GetBalanceOfOutput, getBalanceOf } from 'clients/api';
import { useWeb3 } from 'clients/web3';
import FunctionKey from 'constants/functionKey';

type Options = QueryObserverOptions<
  GetBalanceOfOutput,
  Error,
  GetBalanceOfOutput,
  GetBalanceOfOutput,
  [FunctionKey.GET_BALANCE_OF, string, string]
>;

const useGetBalanceOf = (
  { accountAddress, tokenId }: Omit<GetBalanceOfInput, 'web3'> & { tokenId: TokenId },
  options?: Options,
) => {
  const web3 = useWeb3();

  return useQuery(
    [FunctionKey.GET_BALANCE_OF, accountAddress, tokenId],
    () => getBalanceOf({ web3, accountAddress, tokenId }),
    options,
  );
};

export default useGetBalanceOf;
