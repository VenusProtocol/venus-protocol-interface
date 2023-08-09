import { QueryObserverOptions, useQuery } from 'react-query';
import { callOrThrow } from 'utilities';

import getXvsWithdrawableAmount, {
  GetXvsWithdrawableAmountInput,
  GetXvsWithdrawableAmountOutput,
} from 'clients/api/queries/getXvsWithdrawableAmount';
import { DEFAULT_REFETCH_INTERVAL_MS } from 'constants/defaultRefetchInterval';
import FunctionKey from 'constants/functionKey';
import useGetUniqueContract from 'hooks/useGetUniqueContract';

type TrimmedGetXvsWithdrawableAmountInput = Omit<
  GetXvsWithdrawableAmountInput,
  'xvsVestingContract'
>;

type Options = QueryObserverOptions<
  GetXvsWithdrawableAmountOutput | undefined,
  Error,
  GetXvsWithdrawableAmountOutput | undefined,
  GetXvsWithdrawableAmountOutput | undefined,
  [FunctionKey.GET_XVS_WITHDRAWABLE_AMOUNT, TrimmedGetXvsWithdrawableAmountInput]
>;

const useGetXvsWithdrawableAmount = (
  input: TrimmedGetXvsWithdrawableAmountInput,
  options?: Options,
) => {
  const xvsVestingContract = useGetUniqueContract({
    name: 'xvsVesting',
  });

  return useQuery(
    [FunctionKey.GET_XVS_WITHDRAWABLE_AMOUNT, input],
    () =>
      callOrThrow({ xvsVestingContract }, params =>
        getXvsWithdrawableAmount({ ...params, ...input }),
      ),
    {
      refetchInterval: DEFAULT_REFETCH_INTERVAL_MS,
      ...options,
    },
  );
};

export default useGetXvsWithdrawableAmount;
