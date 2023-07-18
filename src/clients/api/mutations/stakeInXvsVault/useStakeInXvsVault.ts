import { MutationObserverOptions, useMutation } from 'react-query';
import { Token } from 'types';
import { getContractAddress } from 'utilities';

import {
  StakeInXvsVaultInput,
  StakeInXvsVaultOutput,
  queryClient,
  stakeInXvsVault,
} from 'clients/api';
import { useXvsVaultProxyContract } from 'clients/contracts/hooks';
import FunctionKey from 'constants/functionKey';
import { TOKENS } from 'constants/tokens';

const XVS_VAULT_PROXY_CONTRACT_ADDRESS = getContractAddress('xvsVaultProxy');

type Options = MutationObserverOptions<
  StakeInXvsVaultOutput,
  Error,
  Omit<StakeInXvsVaultInput, 'xvsVaultContract'>
>;

const useStakeInXvsVault = ({ stakedToken }: { stakedToken: Token }, options?: Options) => {
  const xvsVaultContract = useXvsVaultProxyContract();

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
        const { poolIndex } = onSuccessParams[1];
        const accountAddress = await xvsVaultContract.signer.getAddress();

        // Invalidate cached user info
        queryClient.invalidateQueries([
          FunctionKey.GET_XVS_VAULT_USER_INFO,
          { accountAddress, rewardTokenAddress: TOKENS.xvs.address, poolIndex },
        ]);

        // Invalidate cached user balance
        queryClient.invalidateQueries([
          FunctionKey.GET_BALANCE_OF,
          {
            accountAddress,
            tokenAddress: stakedToken.address,
          },
        ]);

        queryClient.invalidateQueries([
          FunctionKey.GET_TOKEN_ALLOWANCE,
          {
            tokenAddress: stakedToken.address,
            accountAddress,
          },
        ]);

        queryClient.invalidateQueries([
          FunctionKey.GET_TOKEN_BALANCES,
          {
            accountAddress,
          },
        ]);

        // Invalidate cached vault data
        queryClient.invalidateQueries([
          FunctionKey.GET_BALANCE_OF,
          {
            accountAddress: XVS_VAULT_PROXY_CONTRACT_ADDRESS,
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
