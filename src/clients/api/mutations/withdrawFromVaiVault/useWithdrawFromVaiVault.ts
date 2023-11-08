import { useAnalytics } from 'packages/analytics';
import { useGetVaiVaultContract } from 'packages/contracts';
import { useGetToken } from 'packages/tokens';
import { callOrThrow, convertWeiToTokens } from 'utilities';

import { WithdrawFromVaiVaultInput, queryClient, withdrawFromVaiVault } from 'clients/api';
import FunctionKey from 'constants/functionKey';
import { UseSendTransactionOptions, useSendTransaction } from 'hooks/useSendTransaction';

type TrimmedWithdrawFromVaiVaultInput = Omit<WithdrawFromVaiVaultInput, 'vaiVaultContract'>;
type Options = UseSendTransactionOptions<TrimmedWithdrawFromVaiVaultInput>;

const useWithdrawFromVaiVault = (options?: Options) => {
  const vaiVaultContract = useGetVaiVaultContract({
    passSigner: true,
  });

  const vai = useGetToken({
    symbol: 'VAI',
  });

  const { captureAnalyticEvent } = useAnalytics();

  return useSendTransaction({
    fnKey: FunctionKey.WITHDRAW_FROM_VAI_VAULT,
    fn: (input: TrimmedWithdrawFromVaiVaultInput) =>
      callOrThrow({ vaiVaultContract }, params =>
        withdrawFromVaiVault({
          ...params,
          ...input,
        }),
      ),
    onConfirmed: async ({ input }) => {
      const { amountWei } = input;
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
    },
    options,
  });
};

export default useWithdrawFromVaiVault;
