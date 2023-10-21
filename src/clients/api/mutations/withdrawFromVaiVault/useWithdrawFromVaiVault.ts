import { useAnalytics } from 'packages/analytics';
import { useGetVaiVaultContract } from 'packages/contracts';
import { useGetToken } from 'packages/tokens';
import { MutationObserverOptions, useMutation } from 'react-query';
import { callOrThrow, convertWeiToTokens } from 'utilities';

import {
  WithdrawFromVaiVaultInput,
  WithdrawFromVaiVaultOutput,
  queryClient,
  withdrawFromVaiVault,
} from 'clients/api';
import FunctionKey from 'constants/functionKey';

type TrimmedWithdrawFromVaiVaultInput = Omit<WithdrawFromVaiVaultInput, 'vaiVaultContract'>;
type Options = MutationObserverOptions<
  WithdrawFromVaiVaultOutput,
  Error,
  TrimmedWithdrawFromVaiVaultInput
>;

const useWithdrawFromVaiVault = (options?: Options) => {
  const vaiVaultContract = useGetVaiVaultContract({
    passSigner: true,
  });

  const vai = useGetToken({
    symbol: 'VAI',
  });

  const { captureAnalyticEvent } = useAnalytics();

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
        const { amountWei } = onSuccessParams[1];
        const accountAddress = await vaiVaultContract?.signer.getAddress();

        if (vai) {
          captureAnalyticEvent('Tokens withdrawn from VAI vault', {
            tokenAmountTokens: convertWeiToTokens({
              token: vai,
              valueWei: amountWei,
            }).toNumber(),
          });

          queryClient.invalidateQueries([
            FunctionKey.GET_BALANCE_OF,
            {
              accountAddress,
              tokenAddress: vai.address,
            },
          ]);

          // Invalidate cached vault data
          queryClient.invalidateQueries([
            FunctionKey.GET_BALANCE_OF,
            {
              accountAddress: vaiVaultContract?.address,
              tokenAddress: vai.address,
            },
          ]);
        }

        queryClient.invalidateQueries([FunctionKey.GET_VAI_VAULT_USER_INFO, accountAddress]);

        queryClient.invalidateQueries([
          FunctionKey.GET_TOKEN_BALANCES,
          {
            accountAddress,
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
