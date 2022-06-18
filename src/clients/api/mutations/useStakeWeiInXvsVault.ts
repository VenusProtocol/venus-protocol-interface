import { MutationObserverOptions, useMutation } from 'react-query';

import { TokenId } from 'types';
import {
  queryClient,
  stakeWeiInXvsVault,
  IStakeWeiInXvsVaultInput,
  StakeWeiInXvsVaultOutput,
} from 'clients/api';
import FunctionKey from 'constants/functionKey';
import { XVS_TOKEN_ADDRESS, XVS_VAULT_PROXY_CONTRACT_ADDRESS } from 'constants/xvs';
import { useXvsVaultProxyContract } from 'clients/contracts/hooks';

type Options = MutationObserverOptions<
  StakeWeiInXvsVaultOutput,
  Error,
  Omit<IStakeWeiInXvsVaultInput, 'xvsVaultContract'>
>;

const useStakeWeiInXvsVault = (
  { stakedTokenId }: { stakedTokenId: TokenId },
  options?: Options,
) => {
  const xvsVaultContract = useXvsVaultProxyContract();

  return useMutation(
    FunctionKey.STAKE_WEI_IN_XVS_VAULT,
    (params: Omit<IStakeWeiInXvsVaultInput, 'xvsVaultContract'>) =>
      stakeWeiInXvsVault({
        xvsVaultContract,
        ...params,
      }),
    {
      ...options,
      onSuccess: async (...onSuccessParams) => {
        const { fromAccountAddress, poolIndex } = onSuccessParams[1];

        // Invalidate cached staked token amount
        queryClient.invalidateQueries([
          FunctionKey.GET_XVS_VAULT_USER_INFO,
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

        queryClient.invalidateQueries([
          FunctionKey.GET_XVS_VAULT_PENDING_REWARD_WEI,
          fromAccountAddress,
          XVS_TOKEN_ADDRESS,
          poolIndex,
        ]);

        queryClient.invalidateQueries([
          FunctionKey.GET_XVS_VAULT_USER_INFO,
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

export default useStakeWeiInXvsVault;
