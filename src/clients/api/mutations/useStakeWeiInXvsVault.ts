import { MutationObserverOptions, useMutation } from 'react-query';

import { getToken } from 'utilities';
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
    FunctionKey.CLAIM_XVS_VAULT_REWARD,
    (params: Omit<IStakeWeiInXvsVaultInput, 'xvsVaultContract'>) =>
      stakeWeiInXvsVault({
        xvsVaultContract,
        ...params,
      }),
    {
      ...options,
      onSuccess: async (...onSuccessParams) => {
        const { fromAccountAddress, poolIndex } = onSuccessParams[1];

        // Invalidate staked token amount
        queryClient.invalidateQueries([
          FunctionKey.GET_XVS_VAULT_USER_INFO,
          fromAccountAddress,
          XVS_TOKEN_ADDRESS,
          poolIndex,
        ]);

        // Invalidate user balance
        queryClient.invalidateQueries([
          FunctionKey.GET_BALANCE_OF,
          fromAccountAddress,
          stakedTokenId,
        ]);

        // Invalidate vault data
        const stakedTokenAddress = getToken(stakedTokenId).address;
        queryClient.invalidateQueries([
          FunctionKey.GET_BALANCE_OF,
          XVS_VAULT_PROXY_CONTRACT_ADDRESS,
          stakedTokenAddress,
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
