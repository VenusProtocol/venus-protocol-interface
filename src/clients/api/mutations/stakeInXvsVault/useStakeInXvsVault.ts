import { MutationObserverOptions, useMutation } from 'react-query';
import { getContractAddress, unsafelyGetToken } from 'utilities';

import {
  StakeInXvsVaultInput,
  StakeInXvsVaultOutput,
  queryClient,
  stakeInXvsVault,
} from 'clients/api';
import { useXvsVaultContract } from 'clients/contracts/hooks';
import FunctionKey from 'constants/functionKey';
import { TOKENS } from 'constants/tokens';

const XVS_VAULT_CONTRACT_ADDRESS = getContractAddress('xvsVault');

type Options = MutationObserverOptions<
  StakeInXvsVaultOutput,
  Error,
  Omit<StakeInXvsVaultInput, 'xvsVaultContract'>
>;

const useStakeInXvsVault = ({ stakedTokenId }: { stakedTokenId: string }, options?: Options) => {
  const xvsVaultContract = useXvsVaultContract();

  return useMutation(
    FunctionKey.STAKE_IN_XVS_VAULT,
    (params: Omit<StakeInXvsVaultInput, 'xvsVaultContract'>) =>
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
          { accountAddress: fromAccountAddress, rewardTokenAddress: TOKENS.xvs.address, poolIndex },
        ]);

        // Invalidate cached user pending reward
        queryClient.invalidateQueries([
          FunctionKey.GET_XVS_VAULT_PENDING_REWARD,
          { accountAddress: fromAccountAddress, rewardTokenAddress: TOKENS.xvs.address, poolIndex },
        ]);

        const stakedToken = unsafelyGetToken(stakedTokenId);

        // Invalidate cached user balance
        queryClient.invalidateQueries([
          FunctionKey.GET_BALANCE_OF,
          {
            accountAddress: fromAccountAddress,
            tokenAddress: stakedToken.address,
          },
        ]);

        queryClient.invalidateQueries([
          FunctionKey.GET_TOKEN_BALANCES,
          {
            accountAddress: fromAccountAddress,
          },
        ]);

        // Invalidate cached vault data
        queryClient.invalidateQueries([
          FunctionKey.GET_BALANCE_OF,
          {
            accountAddress: XVS_VAULT_CONTRACT_ADDRESS,
            tokenAddress: stakedToken.address,
          },
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

export default useStakeInXvsVault;
