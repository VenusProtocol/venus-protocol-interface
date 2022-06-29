import { MutationObserverOptions, useMutation } from 'react-query';

import { TokenId } from 'types';
import {
  queryClient,
  stakeInXvsVault,
  IStakeInXvsVaultInput,
  StakeInXvsVaultOutput,
} from 'clients/api';
import FunctionKey from 'constants/functionKey';
import { XVS_TOKEN_ADDRESS } from 'constants/xvs';
import { getContractAddress } from 'utilities';
import { useXvsVaultProxyContract } from 'clients/contracts/hooks';

const XVS_VAULT_PROXY_CONTRACT_ADDRESS = getContractAddress('xvsVaultProxy');

type Options = MutationObserverOptions<
  StakeInXvsVaultOutput,
  Error,
  Omit<IStakeInXvsVaultInput, 'xvsVaultContract'>
>;

const useStakeInXvsVault = ({ stakedTokenId }: { stakedTokenId: TokenId }, options?: Options) => {
  const xvsVaultContract = useXvsVaultProxyContract();

  return useMutation(
    FunctionKey.STAKE_IN_XVS_VAULT,
    (params: Omit<IStakeInXvsVaultInput, 'xvsVaultContract'>) =>
      stakeInXvsVault({
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

export default useStakeInXvsVault;
