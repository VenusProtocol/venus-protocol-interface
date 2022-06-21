import { MutationObserverOptions, useMutation } from 'react-query';

import {
  queryClient,
  stakeWeiInVaiVault,
  IStakeWeiInVaiVaultInput,
  StakeWeiInVaiVaultOutput,
} from 'clients/api';
import FunctionKey from 'constants/functionKey';
import { TOKENS } from 'constants/tokens';
import { useVaiVaultContract } from 'clients/contracts/hooks';
import { getContractAddress } from 'utilities';

const VAI_VAULT_ADDRESS = getContractAddress('vaiVault');

type Options = MutationObserverOptions<
  StakeWeiInVaiVaultOutput,
  Error,
  Omit<IStakeWeiInVaiVaultInput, 'vaiVaultContract'>
>;

const useStakeWeiInVaiVault = (options?: Options) => {
  const vaiVaultContract = useVaiVaultContract();

  return useMutation(
    FunctionKey.STAKE_WEI_IN_VAI_VAULT,
    (params: Omit<IStakeWeiInVaiVaultInput, 'vaiVaultContract'>) =>
      stakeWeiInVaiVault({
        vaiVaultContract,
        ...params,
      }),
    {
      ...options,
      onSuccess: async (...onSuccessParams) => {
        const { fromAccountAddress } = onSuccessParams[1];

        // Invalidate cached user info, including pending reward
        queryClient.invalidateQueries([FunctionKey.GET_VAI_VAULT_USER_INFO, fromAccountAddress]);

        // Invalidate cached user balance
        queryClient.invalidateQueries([
          FunctionKey.GET_BALANCE_OF,
          fromAccountAddress,
          TOKENS.vai.id,
        ]);

        // Invalidate cached vault data
        queryClient.invalidateQueries([
          FunctionKey.GET_BALANCE_OF,
          VAI_VAULT_ADDRESS,
          TOKENS.vai.id,
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
