import { MutationObserverOptions, useMutation } from 'react-query';
import { callOrThrow } from 'utilities';

import { WithdrawXvsOutput, queryClient, withdrawXvs } from 'clients/api';
import { useGetUniqueContract } from 'clients/contracts';
import FunctionKey from 'constants/functionKey';

const useWithdrawXvs = (options?: MutationObserverOptions<WithdrawXvsOutput, Error>) => {
  const xvsVestingContract = useGetUniqueContract({
    name: 'xvsVesting',
  });

  return useMutation(
    FunctionKey.WITHDRAW_XVS,
    () => callOrThrow({ xvsVestingContract }, withdrawXvs),
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
