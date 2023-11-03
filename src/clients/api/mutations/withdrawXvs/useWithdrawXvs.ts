import { useGetXvsVestingContract } from 'packages/contracts';
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
      onSuccess: async (...onSuccessParams) => {
        const accountAddress = await xvsVestingContract?.signer.getAddress();

        queryClient.invalidateQueries(FunctionKey.GET_XVS_WITHDRAWABLE_AMOUNT);

        // Invalidate cached Prime data
        queryClient.invalidateQueries([
          FunctionKey.GET_PRIME_STATUS,
          {
            accountAddress,
          },
        ]);

        queryClient.invalidateQueries([
          FunctionKey.GET_PRIME_TOKEN,
          {
            accountAddress,
          },
        ]);

        if (options?.onSuccess) {
          options.onSuccess(...onSuccessParams);
        }
      },
    },
  );
};

export default useWithdrawXvs;
