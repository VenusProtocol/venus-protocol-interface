import { useGetXvsVestingContract } from 'packages/contractsNew';
import { MutationObserverOptions, useMutation } from 'react-query';
import { callOrThrow } from 'utilities';

import { WithdrawXvsOutput, queryClient, withdrawXvs } from 'clients/api';
import FunctionKey from 'constants/functionKey';

const useWithdrawXvs = (options?: MutationObserverOptions<WithdrawXvsOutput, Error>) => {
  const xvsVestingContract = useGetXvsVestingContract({
    passSigner: true,
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
