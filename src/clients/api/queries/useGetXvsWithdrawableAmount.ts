import { useQuery, QueryObserverOptions } from 'react-query';

import getXvsWithdrawableAmount, {
  IGetXvsWithdrawableAmountInput,
  IGetXvsWithdrawableAmountOutput,
} from 'clients/api/queries/getXvsWithdrawableAmount';
import FunctionKey from 'constants/functionKey';
import { useXvsVestingProxyContract } from 'clients/contracts/hooks';

type Options = QueryObserverOptions<
  IGetXvsWithdrawableAmountOutput,
  Error,
  IGetXvsWithdrawableAmountOutput,
  IGetXvsWithdrawableAmountOutput,
  FunctionKey.GET_XVS_WITHDRAWABLE_AMOUNT
>;

const useGetXvsWithdrawableAmount = (
  { accountAddress }: Omit<IGetXvsWithdrawableAmountInput, 'xvsTokenContract'>,
  options?: Options,
) => {
  const xvsVestingContract = useXvsVestingProxyContract();

  return useQuery(
    FunctionKey.GET_XVS_WITHDRAWABLE_AMOUNT,
    () => getXvsWithdrawableAmount({ xvsVestingContract, accountAddress }),
    options,
  );
};

export default useGetXvsWithdrawableAmount;
