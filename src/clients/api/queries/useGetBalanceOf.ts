import { useQuery, QueryObserverOptions } from 'react-query';

import getBalanceOf, {
  IGetBalanceOfInput,
  GetBalanceOfOutput,
} from 'clients/api/queries/getBalanceOf';
import FunctionKey from 'constants/functionKey';
import { useTokenContract } from 'clients/contracts/hooks';
import { TokenId } from 'types';

type Options = QueryObserverOptions<
  GetBalanceOfOutput,
  Error,
  GetBalanceOfOutput,
  GetBalanceOfOutput,
  FunctionKey.GET_BALANCE_OF
>;

const useGetBalanceOf = (
  { accountAddress, tokenId }: Omit<IGetBalanceOfInput, 'tokenContract'> & { tokenId: TokenId },
  options?: Options,
) => {
  const tokenContract = useTokenContract(tokenId);

  return useQuery(
    FunctionKey.GET_BALANCE_OF,
    () => getBalanceOf({ tokenContract, accountAddress }),
    options,
  );
};

export default useGetBalanceOf;
