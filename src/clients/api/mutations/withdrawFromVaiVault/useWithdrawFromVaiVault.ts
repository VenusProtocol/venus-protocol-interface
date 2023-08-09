import { MutationObserverOptions, useMutation } from 'react-query';
import { callOrThrow, getContractAddress } from 'utilities';

import {
  WithdrawFromVaiVaultInput,
  WithdrawFromVaiVaultOutput,
  queryClient,
  withdrawFromVaiVault,
} from 'clients/api';
import FunctionKey from 'constants/functionKey';
import { TOKENS } from 'constants/tokens';
import useGetUniqueContract from 'hooks/useGetUniqueContract';

const VAI_VAULT_ADDRESS = getContractAddress('vaiVault');

type TrimmedWithdrawFromVaiVaultInput = Omit<WithdrawFromVaiVaultInput, 'vaiVaultContract'>;
type Options = MutationObserverOptions<
  WithdrawFromVaiVaultOutput,
  Error,
  TrimmedWithdrawFromVaiVaultInput
>;

const useWithdrawFromVaiVault = (options?: Options) => {
  const vaiVaultContract = useGetUniqueContract({
    name: 'vaiVault',
  });

  return useMutation(
    FunctionKey.WITHDRAW_FROM_VAI_VAULT,
    (input: TrimmedWithdrawFromVaiVaultInput) =>
      callOrThrow({ vaiVaultContract }, params =>
        withdrawFromVaiVault({
          ...params,
          ...input,
        }),
      ),
    {
      ...options,
      onSuccess: async (...onSuccessParams) => {
        const accountAddress = await vaiVaultContract?.signer.getAddress();

        // Invalidate cached user info, including staked amount
        queryClient.invalidateQueries([FunctionKey.GET_VAI_VAULT_USER_INFO, accountAddress]);

        // Invalidate cached user balance
        queryClient.invalidateQueries([
          FunctionKey.GET_BALANCE_OF,
          {
            accountAddress,
            tokenAddress: TOKENS.vai.address,
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

export default useWithdrawFromVaiVault;
