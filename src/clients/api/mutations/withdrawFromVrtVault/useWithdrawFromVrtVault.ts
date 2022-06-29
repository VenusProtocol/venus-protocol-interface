import { MutationObserverOptions, useMutation } from 'react-query';

import {
  queryClient,
  withdrawFromVrtVault,
  IWithdrawFromVrtVaultInput,
  WithdrawFromVrtVaultOutput,
} from 'clients/api';
import FunctionKey from 'constants/functionKey';
import { TOKENS } from 'constants/tokens';
import { useVrtVaultProxyContract } from 'clients/contracts/hooks';
import { getContractAddress } from 'utilities';

const VRT_VAULT_PROXY_CONTRACT_ADDRESS = getContractAddress('vrtVaultProxy');

type Options = MutationObserverOptions<
  WithdrawFromVrtVaultOutput,
  Error,
  Omit<IWithdrawFromVrtVaultInput, 'vrtVaultContract'>
>;

const useWithdrawFromVrtVault = (options?: Options) => {
  const vrtVaultContract = useVrtVaultProxyContract();

  return useMutation(
    FunctionKey.WITHDRAW_FROM_VAI_VAULT,
    (params: Omit<IWithdrawFromVrtVaultInput, 'vrtVaultContract'>) =>
      withdrawFromVrtVault({
        vrtVaultContract,
        ...params,
      }),
    {
      ...options,
      onSuccess: async (...onSuccessParams) => {
        const { fromAccountAddress } = onSuccessParams[1];

        // Invalidate cached user info, including staked amount
        queryClient.invalidateQueries([FunctionKey.GET_VRT_VAULT_USER_INFO, fromAccountAddress]);

        // Invalidate cached user pending reward
        queryClient.invalidateQueries([
          FunctionKey.GET_VRT_VAULT_ACCRUED_INTEREST_WEI,
          fromAccountAddress,
        ]);

        // Invalidate cached user balance
        queryClient.invalidateQueries([
          FunctionKey.GET_BALANCE_OF,
          fromAccountAddress,
          TOKENS.vrt.id,
        ]);

        // Invalidate cached vault data
        queryClient.invalidateQueries([
          FunctionKey.GET_BALANCE_OF,
          VRT_VAULT_PROXY_CONTRACT_ADDRESS,
          TOKENS.vrt.id,
        ]);

        queryClient.invalidateQueries(FunctionKey.GET_VRT_VAULT_INTEREST_RATE_WEI_PER_BLOCK);

        if (options?.onSuccess) {
          options.onSuccess(...onSuccessParams);
        }
      },
    },
  );
};

export default useWithdrawFromVrtVault;
