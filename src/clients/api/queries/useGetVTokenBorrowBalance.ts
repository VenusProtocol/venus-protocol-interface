import { useQuery, QueryObserverOptions } from 'react-query';

import { VTokenId } from 'types';
import getVTokenBorrowBalance, {
  IGetVTokenBorrowBalanceInput,
  GetVTokenBorrowBalanceOutput,
} from 'clients/api/queries/getVTokenBorrowBalance';
import FunctionKey from 'constants/functionKey';
import { useVTokenContract } from 'clients/contracts/hooks';

interface TrimmedParams extends Omit<IGetVTokenBorrowBalanceInput, 'vTokenContract'> {
  vTokenId: VTokenId;
}

type Options = QueryObserverOptions<
  GetVTokenBorrowBalanceOutput,
  Error,
  GetVTokenBorrowBalanceOutput,
  GetVTokenBorrowBalanceOutput,
  [FunctionKey.GET_V_TOKEN_BORROW_BALANCE, TrimmedParams]
>;

const useGetVTokenBorrowBalance = (params: TrimmedParams, options?: Options) => {
  const vTokenContract = useVTokenContract(params.vTokenId);

  return useQuery(
    [FunctionKey.GET_V_TOKEN_BORROW_BALANCE, params],
    () => getVTokenBorrowBalance({ accountAddress: params.accountAddress, vTokenContract }),
    options,
  );
};

export default useGetVTokenBorrowBalance;
