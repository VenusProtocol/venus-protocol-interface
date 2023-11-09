import { useGetXvsVestingContract } from 'packages/contracts';
import { QueryObserverOptions, useQuery } from 'react-query';
import { ChainId } from 'types';
import { callOrThrow } from 'utilities';

import getXvsWithdrawableAmount, {
  GetXvsWithdrawableAmountInput,
  GetXvsWithdrawableAmountOutput,
} from 'clients/api/queries/getXvsWithdrawableAmount';
import FunctionKey from 'constants/functionKey';
import { useAuth } from 'context/AuthContext';

type TrimmedGetXvsWithdrawableAmountInput = Omit<
  GetXvsWithdrawableAmountInput,
  'xvsVestingContract'
>;

export type UseGetXvsWithdrawableAmountQueryKey = [
  FunctionKey.GET_XVS_WITHDRAWABLE_AMOUNT,
  TrimmedGetXvsWithdrawableAmountInput & {
    chainId: ChainId;
  },
];

type Options = QueryObserverOptions<
  GetXvsWithdrawableAmountOutput | undefined,
  Error,
  GetXvsWithdrawableAmountOutput | undefined,
  GetXvsWithdrawableAmountOutput | undefined,
  UseGetXvsWithdrawableAmountQueryKey
>;

const useGetXvsWithdrawableAmount = (
  input: TrimmedGetXvsWithdrawableAmountInput,
  options?: Options,
) => {
  const { chainId } = useAuth();
  const xvsVestingContract = useGetXvsVestingContract();

  return useQuery(
    [FunctionKey.GET_XVS_WITHDRAWABLE_AMOUNT, { ...input, chainId }],
    () =>
      callOrThrow({ xvsVestingContract }, params =>
        getXvsWithdrawableAmount({ ...params, ...input }),
      ),
    options,
  );
};

export default useGetXvsWithdrawableAmount;
