import { MutationObserverOptions, useMutation } from 'react-query';

import {
  RequestWithdrawalFromXvsVaultInput,
  RequestWithdrawalFromXvsVaultOutput,
  queryClient,
  requestWithdrawalFromXvsVault,
} from 'clients/api';
import { useXvsVaultContract } from 'clients/contracts/hooks';
import FunctionKey from 'constants/functionKey';
import { TOKENS } from 'constants/tokens';

type Options = MutationObserverOptions<
  RequestWithdrawalFromXvsVaultOutput,
  Error,
  Omit<RequestWithdrawalFromXvsVaultInput, 'xvsVaultContract'>
>;

const useRequestWithdrawalFromXvsVault = (options?: Options) => {
  const xvsVaultContract = useXvsVaultContract();

  return useMutation(
    FunctionKey.REQUEST_WITHDRAWAL_FROM_XVS_VAULT,
    (params: Omit<RequestWithdrawalFromXvsVaultInput, 'xvsVaultContract'>) =>
      requestWithdrawalFromXvsVault({
        xvsVaultContract,
        ...params,
      }),
    {
      ...options,
      onSuccess: async (...onSuccessParams) => {
        const { fromAccountAddress, poolIndex } = onSuccessParams[1];

        // Invalidate cached user info
        queryClient.invalidateQueries([
          FunctionKey.GET_XVS_VAULT_USER_INFO,
          { accountAddress: fromAccountAddress, rewardTokenAddress: TOKENS.xvs.address, poolIndex },
        ]);

        // Invalidate cached user pending reward
        queryClient.invalidateQueries([
          FunctionKey.GET_XVS_VAULT_PENDING_REWARD,
          { accountAddress: fromAccountAddress, rewardTokenAddress: TOKENS.xvs.address, poolIndex },
        ]);

        // Invalidate cached user withdrawal requests
        queryClient.invalidateQueries([
          FunctionKey.GET_XVS_VAULT_WITHDRAWAL_REQUESTS,
          { accountAddress: fromAccountAddress, rewardTokenAddress: TOKENS.xvs.address, poolIndex },
        ]);

        if (options?.onSuccess) {
          options.onSuccess(...onSuccessParams);
        }
      },
    },
  );
};

export default useRequestWithdrawalFromXvsVault;
