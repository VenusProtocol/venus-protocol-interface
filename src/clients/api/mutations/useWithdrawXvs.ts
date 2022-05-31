import { useMutation, MutationObserverOptions } from 'react-query';

import queryClient from 'clients/api/queryClient';
import { withdrawXvs, IWithdrawXvsInput, WithdrawXvsOutput } from 'clients/api';
import FunctionKey from 'constants/functionKey';
import { useXvsVestingProxyContract } from 'clients/contracts/hooks';

const useWithdrawXvs = (
  options?: MutationObserverOptions<
    WithdrawXvsOutput,
    Error,
    Omit<IWithdrawXvsInput, 'xvsVestingContract'>
  >,
) => {
  const xvsVestingContract = useXvsVestingProxyContract();
  return useMutation(
    FunctionKey.WITHDRAW_XVS,
    params =>
      withdrawXvs({
        xvsVestingContract,
        ...params,
      }),
    {
      ...options,
      onSuccess: (...onSuccessParams) => {
        queryClient.invalidateQueries(FunctionKey.GET_XVS_WITHDRAWABLE_AMOUNT);

        if (options?.onSuccess) {
          options.onSuccess(...onSuccessParams);
        }
      },
    },
  );
};

export default useWithdrawXvs;
