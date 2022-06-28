import { MutationObserverOptions, useMutation } from 'react-query';

import {
  queryClient,
  requestWithdrawalFromXvsVault,
  IRequestWithdrawalFromXvsVaultInput,
  RequestWithdrawalFromXvsVaultOutput,
} from 'clients/api';
import FunctionKey from 'constants/functionKey';
import { XVS_TOKEN_ADDRESS } from 'constants/xvs';
import { useXvsVaultProxyContract } from 'clients/contracts/hooks';

type Options = MutationObserverOptions<
  RequestWithdrawalFromXvsVaultOutput,
  Error,
  Omit<IRequestWithdrawalFromXvsVaultInput, 'xvsVaultContract'>
>;

const useRequestWithdrawalFromXvsVault = (options?: Options) => {
  const xvsVaultContract = useXvsVaultProxyContract();

  return useMutation(
    FunctionKey.REQUEST_WITHDRAWAL_FROM_XVS_VAULT,
    (params: Omit<IRequestWithdrawalFromXvsVaultInput, 'xvsVaultContract'>) =>
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
          fromAccountAddress,
          XVS_TOKEN_ADDRESS,
          poolIndex,
        ]);

        // Invalidate cached user pending reward
        queryClient.invalidateQueries([
          FunctionKey.GET_XVS_VAULT_PENDING_REWARD_WEI,
          fromAccountAddress,
          XVS_TOKEN_ADDRESS,
          poolIndex,
        ]);

        if (options?.onSuccess) {
          options.onSuccess(...onSuccessParams);
        }
      },
    },
  );
};

export default useRequestWithdrawalFromXvsVault;
