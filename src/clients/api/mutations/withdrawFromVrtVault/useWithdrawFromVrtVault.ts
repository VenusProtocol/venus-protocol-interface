import { MutationObserverOptions, useMutation } from 'react-query';
import { getContractAddress } from 'utilities';

import { WithdrawFromVrtVaultOutput, queryClient, withdrawFromVrtVault } from 'clients/api';
import { useVrtVaultProxyContract } from 'clients/contracts/hooks';
import FunctionKey from 'constants/functionKey';
import { TOKENS } from 'constants/tokens';

const VRT_VAULT_PROXY_CONTRACT_ADDRESS = getContractAddress('vrtVaultProxy');

type Options = MutationObserverOptions<WithdrawFromVrtVaultOutput, Error>;

const useWithdrawFromVrtVault = (options?: Options) => {
  const vrtVaultContract = useVrtVaultProxyContract();

  return useMutation(
    FunctionKey.WITHDRAW_FROM_VAI_VAULT,
    () =>
      withdrawFromVrtVault({
        vrtVaultContract,
      }),
    {
      ...options,
      onSuccess: async (...onSuccessParams) => {
        const accountAddress = await vrtVaultContract.signer.getAddress();

        // Invalidate cached user info, including staked amount
        queryClient.invalidateQueries([FunctionKey.GET_VRT_VAULT_USER_INFO, accountAddress]);

        // Invalidate cached user pending reward
        queryClient.invalidateQueries([FunctionKey.GET_VRT_VAULT_ACCRUED_INTEREST, accountAddress]);

        // Invalidate cached user balance
        queryClient.invalidateQueries([
          FunctionKey.GET_BALANCE_OF,
          {
            accountAddress,
            tokenAddress: TOKENS.vrt.address,
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
