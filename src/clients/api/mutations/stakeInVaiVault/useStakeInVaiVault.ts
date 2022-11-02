import { MutationObserverOptions, useMutation } from 'react-query';
import { getContractAddress } from 'utilities';

import {
  StakeInVaiVaultInput,
  StakeInVaiVaultOutput,
  queryClient,
  stakeInVaiVault,
} from 'clients/api';
import { useVaiVaultContract } from 'clients/contracts/hooks';
import FunctionKey from 'constants/functionKey';
import { TOKENS } from 'constants/tokens';

const VAI_VAULT_ADDRESS = getContractAddress('vaiVault');

type Options = MutationObserverOptions<
  StakeInVaiVaultOutput,
  Error,
  Omit<StakeInVaiVaultInput, 'vaiVaultContract'>
>;

const useStakeInVaiVault = (options?: Options) => {
  const vaiVaultContract = useVaiVaultContract();

  return useMutation(
    FunctionKey.STAKE_IN_VAI_VAULT,
    (params: Omit<StakeInVaiVaultInput, 'vaiVaultContract'>) =>
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
          {
            accountAddress: fromAccountAddress,
            tokenAddress: TOKENS.vai.address,
          },
        ]);

        // Invalidate cached vault data
        queryClient.invalidateQueries([
          FunctionKey.GET_BALANCE_OF,
          {
            accountAddress: VAI_VAULT_ADDRESS,
            tokenAddress: TOKENS.vai.address,
          },
        ]);

        queryClient.invalidateQueries(FunctionKey.GET_VENUS_VAI_VAULT_DAILY_RATE);

        if (options?.onSuccess) {
          options.onSuccess(...onSuccessParams);
        }
      },
    },
  );
};

export default useStakeInVaiVault;
