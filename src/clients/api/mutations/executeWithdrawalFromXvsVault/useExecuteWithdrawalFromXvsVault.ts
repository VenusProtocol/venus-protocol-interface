import { MutationObserverOptions, useMutation } from 'react-query';
import { TokenId } from 'types';
import { getContractAddress } from 'utilities';

import {
  ExecuteWithdrawalFromXvsVaultInput,
  ExecuteWithdrawalFromXvsVaultOutput,
  executeWithdrawalFromXvsVault,
  queryClient,
} from 'clients/api';
import { useXvsVaultProxyContract } from 'clients/contracts/hooks';
import FunctionKey from 'constants/functionKey';
import { TOKENS } from 'constants/tokens';

const XVS_VAULT_PROXY_CONTRACT_ADDRESS = getContractAddress('xvsVaultProxy');

type Options = MutationObserverOptions<
  ExecuteWithdrawalFromXvsVaultOutput,
  Error,
  Omit<ExecuteWithdrawalFromXvsVaultInput, 'xvsVaultContract'>
>;

const useExecuteWithdrawalFromXvsVault = (
  { stakedTokenId }: { stakedTokenId: TokenId },
  options?: Options,
) => {
  const xvsVaultContract = useXvsVaultProxyContract();

  return useMutation(
    FunctionKey.REQUEST_WITHDRAWAL_FROM_XVS_VAULT,
    (params: Omit<ExecuteWithdrawalFromXvsVaultInput, 'xvsVaultContract'>) =>
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
          {
            rewardTokenAddress: TOKENS.xvs.address,
            poolIndex,
            accountAddress: fromAccountAddress,
          },
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
          { rewardTokenAddress: TOKENS.xvs.address, poolIndex },
        ]);

        if (options?.onSuccess) {
          options.onSuccess(...onSuccessParams);
        }
      },
    },
  );
};

export default useExecuteWithdrawalFromXvsVault;
