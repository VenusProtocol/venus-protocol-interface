import { MutationObserverOptions, useMutation } from 'react-query';

import {
  RequestWithdrawalFromXvsVaultInput,
  RequestWithdrawalFromXvsVaultOutput,
  queryClient,
  requestWithdrawalFromXvsVault,
} from 'clients/api';
import { useXvsVaultProxyContract } from 'clients/contracts/hooks';
import FunctionKey from 'constants/functionKey';
import { XVS_TOKEN_ADDRESS } from 'constants/xvs';

type Options = MutationObserverOptions<
  RequestWithdrawalFromXvsVaultOutput,
  Error,
  Omit<RequestWithdrawalFromXvsVaultInput, 'xvsVaultContract'>
>;

const useRequestWithdrawalFromXvsVault = (options?: Options) => {
  const xvsVaultContract = useXvsVaultProxyContract();

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
          { accountAddress: fromAccountAddress, rewardTokenAddress: XVS_TOKEN_ADDRESS, poolIndex },
        ]);

        // Invalidate cached user pending reward
        queryClient.invalidateQueries([
          FunctionKey.GET_XVS_VAULT_PENDING_REWARD_WEI,
          { accountAddress: fromAccountAddress, rewardTokenAddress: XVS_TOKEN_ADDRESS, poolIndex },
        ]);

        // Invalidate cached user withdrawal requests
        queryClient.invalidateQueries([
          FunctionKey.GET_XVS_VAULT_WITHDRAWAL_REQUESTS,
          { accountAddress: fromAccountAddress, rewardTokenAddress: XVS_TOKEN_ADDRESS, poolIndex },
        ]);

        if (options?.onSuccess) {
          options.onSuccess(...onSuccessParams);
        }
      },
    },
  );
};

export default useRequestWithdrawalFromXvsVault;
