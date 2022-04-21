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
  { accountAddress, vTokenId }: { accountAddress: string; vTokenId: VTokenId },
  options?: Options,
) => {
  const vTokenContract = useVTokenContract(vTokenId);

  return useQuery(
    [FunctionKey.GET_V_TOKEN_BORROW_BALANCE, vTokenId],
    () => getVTokenBorrowBalance({ accountAddress, vTokenContract }),
    options,
  );
};

export default useGetVTokenBorrowBalance;
