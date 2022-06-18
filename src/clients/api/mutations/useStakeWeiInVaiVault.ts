import { MutationObserverOptions, useMutation } from 'react-query';

import { TokenId } from 'types';
import {
  queryClient,
  stakeWeiInVaiVault,
  IStakeWeiInVaiVaultInput,
  StakeWeiInVaiVaultOutput,
} from 'clients/api';
import FunctionKey from 'constants/functionKey';
import { VAI_VAULT_ADDRESS } from 'constants/vai';
import { useVaiVaultContract } from 'clients/contracts/hooks';

type Options = MutationObserverOptions<
  StakeWeiInVaiVaultOutput,
  Error,
  Omit<IStakeWeiInVaiVaultInput, 'vaiVaultContract'>
>;

const useStakeWeiInVaiVault = (
  { stakedTokenId }: { stakedTokenId: TokenId },
  options?: Options,
) => {
  const vaiVaultContract = useVaiVaultContract();

  return useMutation(
    FunctionKey.STAKE_WEI_IN_XVS_VAULT,
    (params: Omit<IStakeWeiInVaiVaultInput, 'vaiVaultContract'>) =>
      stakeWeiInVaiVault({
        vaiVaultContract,
        ...params,
      }),
    {
      ...options,
      onSuccess: async (...onSuccessParams) => {
        const { fromAccountAddress } = onSuccessParams[1];

        // Invalidate cached staked token amount
        queryClient.invalidateQueries([FunctionKey.GET_VAI_VAULT_USER_INFO, fromAccountAddress]);

        // Invalidate cached user balance
        queryClient.invalidateQueries([
          FunctionKey.GET_BALANCE_OF,
          fromAccountAddress,
          stakedTokenId,
        ]);

        // Invalidate cached vault data
        // const stakedTokenAddress = getToken(stakedTokenId).address;
        queryClient.invalidateQueries([
          FunctionKey.GET_BALANCE_OF,
          VAI_VAULT_ADDRESS,
          stakedTokenId,
        ]);

        queryClient.invalidateQueries(FunctionKey.GET_VENUS_VAI_VAULT_DAILY_RATE_WEI);

        if (options?.onSuccess) {
          options.onSuccess(...onSuccessParams);
        }
      },
    },
  );
};

export default useStakeWeiInVaiVault;
