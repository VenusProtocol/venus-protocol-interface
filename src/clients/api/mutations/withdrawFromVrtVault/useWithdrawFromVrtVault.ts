import { MutationObserverOptions, useMutation } from 'react-query';
import { getContractAddress } from 'utilities';

import {
  WithdrawFromVrtVaultInput,
  WithdrawFromVrtVaultOutput,
  queryClient,
  withdrawFromVrtVault,
} from 'clients/api';
import { useVrtVaultProxyContract } from 'clients/contracts/hooks';
import FunctionKey from 'constants/functionKey';
import { TOKENS } from 'constants/tokens';

const VRT_VAULT_PROXY_CONTRACT_ADDRESS = getContractAddress('vrtVaultProxy');

type Options = MutationObserverOptions<
  WithdrawFromVrtVaultOutput,
  Error,
  Omit<WithdrawFromVrtVaultInput, 'vrtVaultContract'>
>;

const useWithdrawFromVrtVault = (options?: Options) => {
  const vrtVaultContract = useVrtVaultProxyContract();

  return useMutation(
    FunctionKey.WITHDRAW_FROM_VAI_VAULT,
    (params: Omit<WithdrawFromVrtVaultInput, 'vrtVaultContract'>) =>
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
          FunctionKey.GET_VRT_VAULT_ACCRUED_INTEREST,
          fromAccountAddress,
        ]);

        // Invalidate cached user balance
        queryClient.invalidateQueries([
          FunctionKey.GET_BALANCE_OF,
          {
            accountAddress: fromAccountAddress,
            tokenAddress: TOKENS.vrt.address,
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
            accountAddress: VRT_VAULT_PROXY_CONTRACT_ADDRESS,
            tokenAddress: TOKENS.vrt.address,
          },
        ]);

        queryClient.invalidateQueries(FunctionKey.GET_VRT_VAULT_INTEREST_RATE_PER_BLOCK);

        if (options?.onSuccess) {
          options.onSuccess(...onSuccessParams);
        }
      },
    },
  );
};

export default useWithdrawFromVrtVault;
