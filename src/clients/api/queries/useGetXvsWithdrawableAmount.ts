import { QueryObserverOptions, useQuery } from 'react-query';

import getXvsWithdrawableAmount, {
  IGetXvsWithdrawableAmountInput,
  IGetXvsWithdrawableAmountOutput,
} from 'clients/api/queries/getXvsWithdrawableAmount';
import { useXvsVestingProxyContract } from 'clients/contracts/hooks';
import { DEFAULT_REFETCH_INTERVAL_MS } from 'constants/defaultRefetchInterval';
import FunctionKey from 'constants/functionKey';

type Options = QueryObserverOptions<
  IGetXvsWithdrawableAmountOutput,
  Error,
  IGetXvsWithdrawableAmountOutput,
  IGetXvsWithdrawableAmountOutput,
  FunctionKey.GET_XVS_WITHDRAWABLE_AMOUNT
>;

const useGetXvsWithdrawableAmount = (
  { accountAddress }: Omit<IGetXvsWithdrawableAmountInput, 'xvsVestingContract'>,
  options?: Options,
) => {
  const xvsVestingContract = useXvsVestingProxyContract();

  return useQuery(
    FunctionKey.GET_XVS_WITHDRAWABLE_AMOUNT,
    () => getXvsWithdrawableAmount({ xvsVestingContract, accountAddress }),
    {
      refetchInterval: DEFAULT_REFETCH_INTERVAL_MS,
      ...options,
    },
  );
};

export default useGetXvsWithdrawableAmount;
