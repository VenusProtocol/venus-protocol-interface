import { MutationObserverOptions, useMutation } from 'react-query';

import {
  queryClient,
  executeWithdrawalFromXvsVault,
  IExecuteWithdrawalFromXvsVaultInput,
  ExecuteWithdrawalFromXvsVaultOutput,
} from 'clients/api';
import { TokenId } from 'types';
import FunctionKey from 'constants/functionKey';
import { XVS_TOKEN_ADDRESS } from 'constants/xvs';
import { useXvsVaultProxyContract } from 'clients/contracts/hooks';
import { getContractAddress } from 'utilities';

const XVS_VAULT_PROXY_CONTRACT_ADDRESS = getContractAddress('xvsVaultProxy');

type Options = MutationObserverOptions<
  ExecuteWithdrawalFromXvsVaultOutput,
  Error,
  Omit<IExecuteWithdrawalFromXvsVaultInput, 'xvsVaultContract'>
>;

const useExecuteWithdrawalFromXvsVault = (
  { stakedTokenId }: { stakedTokenId: TokenId },
  options?: Options,
) => {
  const xvsVaultContract = useXvsVaultProxyContract();

  return useMutation(
    FunctionKey.REQUEST_WITHDRAWAL_FROM_XVS_VAULT,
    (params: Omit<IExecuteWithdrawalFromXvsVaultInput, 'xvsVaultContract'>) =>
      executeWithdrawalFromXvsVault({
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

        // Invalidate cached user balance
        queryClient.invalidateQueries([
          FunctionKey.GET_BALANCE_OF,
          fromAccountAddress,
          stakedTokenId,
        ]);

        // Invalidate cached vault data
        queryClient.invalidateQueries([
          FunctionKey.GET_BALANCE_OF,
          XVS_VAULT_PROXY_CONTRACT_ADDRESS,
          stakedTokenId,
        ]);

        queryClient.invalidateQueries([
          FunctionKey.GET_XVS_VAULT_POOL_INFOS,
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

export default useExecuteWithdrawalFromXvsVault;
