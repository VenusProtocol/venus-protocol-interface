import { MutationObserverOptions, useMutation } from 'react-query';

import { IWithdrawXvsInput, WithdrawXvsOutput, withdrawXvs } from 'clients/api';
import queryClient from 'clients/api/queryClient';
import { useXvsVestingProxyContract } from 'clients/contracts/hooks';
import FunctionKey from 'constants/functionKey';

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
