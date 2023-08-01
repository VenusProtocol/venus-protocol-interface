import { QueryObserverOptions, useQuery } from 'react-query';

import getXvsWithdrawableAmount, {
  GetXvsWithdrawableAmountInput,
  GetXvsWithdrawableAmountOutput,
} from 'clients/api/queries/getXvsWithdrawableAmount';
import { useGetUniqueContract } from 'clients/contracts';
import { DEFAULT_REFETCH_INTERVAL_MS } from 'constants/defaultRefetchInterval';
import FunctionKey from 'constants/functionKey';

type Options = QueryObserverOptions<
  GetXvsWithdrawableAmountOutput | undefined,
  Error,
  GetXvsWithdrawableAmountOutput | undefined,
  GetXvsWithdrawableAmountOutput | undefined,
  FunctionKey.GET_XVS_WITHDRAWABLE_AMOUNT
>;

const useGetXvsWithdrawableAmount = (
  { accountAddress }: Omit<GetXvsWithdrawableAmountInput, 'xvsVestingContract'>,
  options?: Options,
) => {
  const xvsVestingContract = useGetUniqueContract({
    name: 'xvsVesting',
  });

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
