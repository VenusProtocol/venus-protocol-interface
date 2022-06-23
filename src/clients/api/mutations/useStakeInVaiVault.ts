import { MutationObserverOptions, useMutation } from 'react-query';

import {
  queryClient,
  stakeInVaiVault,
  IStakeInVaiVaultInput,
  StakeInVaiVaultOutput,
} from 'clients/api';
import FunctionKey from 'constants/functionKey';
import { TOKENS } from 'constants/tokens';
import { useVaiVaultContract } from 'clients/contracts/hooks';
import { getContractAddress } from 'utilities';

const VAI_VAULT_ADDRESS = getContractAddress('vaiVault');

type Options = MutationObserverOptions<
  StakeInVaiVaultOutput,
  Error,
  Omit<IStakeInVaiVaultInput, 'vaiVaultContract'>
>;

const useStakeInVaiVault = (options?: Options) => {
  const vaiVaultContract = useVaiVaultContract();

  return useMutation(
<<<<<<< HEAD
    FunctionKey.STAKE_IN_VAI_VAULT,
=======
    FunctionKey.STAKE__IN_VAI_VAULT,
>>>>>>> dcb6db4d (add executeWithdrawalFromXvsVault mutation function)
    (params: Omit<IStakeInVaiVaultInput, 'vaiVaultContract'>) =>
      stakeInVaiVault({
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

export default useStakeInVaiVault;
