import { useQuery, QueryObserverOptions } from 'react-query';

import { VTokenId } from 'types';
import getVTokenBorrowBalance, {
  GetVTokenBorrowBalanceOutput,
} from 'clients/api/queries/getVTokenBorrowBalance';
import FunctionKey from 'constants/functionKey';
import { useVTokenContract } from 'clients/contracts/hooks';

type Options = QueryObserverOptions<
  GetVTokenBorrowBalanceOutput,
  Error,
  GetVTokenBorrowBalanceOutput,
  GetVTokenBorrowBalanceOutput,
  [FunctionKey.GET_V_TOKEN_BORROW_BALANCE, VTokenId]
>;

const useGetVTokenBorrowBalance = (
  { accountAddress, tokenId }: { accountAddress: string; tokenId: VTokenId },
  options?: Options,
) => {
  const vTokenContract = useVTokenContract(tokenId);

  return useQuery(
    [FunctionKey.GET_V_TOKEN_BORROW_BALANCE, tokenId],
    () => getVTokenBorrowBalance({ accountAddress, vTokenContract }),
    options,
  );
};

export default useGetVTokenBorrowBalance;
