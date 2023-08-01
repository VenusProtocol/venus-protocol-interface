import { VError } from 'errors';
import { MutationObserverOptions, useMutation } from 'react-query';

import { WithdrawXvsOutput, queryClient, withdrawXvs } from 'clients/api';
import { useGetUniqueContract } from 'clients/contracts';
import FunctionKey from 'constants/functionKey';
import { logError } from 'context/ErrorLogger';

const useWithdrawXvs = (options?: MutationObserverOptions<WithdrawXvsOutput, Error>) => {
  const xvsVestingContract = useGetUniqueContract({
    name: 'xvsVesting',
  });

  const handleWithdrawXvs = () => {
    if (!xvsVestingContract) {
      logError('Contract infos missing for withdrawXvs mutation function call');
      throw new VError({ type: 'unexpected', code: 'somethingWentWrong' });
    }

    return withdrawXvs({
      xvsVestingContract,
    });
  };

  return useMutation(FunctionKey.WITHDRAW_XVS, handleWithdrawXvs, {
    ...options,
    onSuccess: (...onSuccessParams) => {
      queryClient.invalidateQueries(FunctionKey.GET_XVS_WITHDRAWABLE_AMOUNT);

      if (options?.onSuccess) {
        options.onSuccess(...onSuccessParams);
      }
    },
  });
};

export default useWithdrawXvs;
