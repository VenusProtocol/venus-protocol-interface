import { MutationObserverOptions, useMutation } from 'react-query';

import { WithdrawXvsOutput, queryClient, withdrawXvs } from 'clients/api';
import { useXvsVestingProxyContract } from 'clients/contracts/hooks';
import FunctionKey from 'constants/functionKey';

const useWithdrawXvs = (options?: MutationObserverOptions<WithdrawXvsOutput, Error>) => {
  const xvsVestingContract = useXvsVestingProxyContract();

  return useMutation(
    FunctionKey.WITHDRAW_XVS,
    () =>
      withdrawXvs({
        xvsVestingContract,
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
