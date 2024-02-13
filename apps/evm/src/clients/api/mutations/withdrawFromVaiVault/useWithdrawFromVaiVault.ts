import { WithdrawFromVaiVaultInput, queryClient, withdrawFromVaiVault } from 'clients/api';
import FunctionKey from 'constants/functionKey';
import { UseSendTransactionOptions, useSendTransaction } from 'hooks/useSendTransaction';
import { useAnalytics } from 'libs/analytics';
import { useGetVaiVaultContract } from 'libs/contracts';
import { useGetToken } from 'libs/tokens';
import { useChainId } from 'libs/wallet';
import { callOrThrow, convertMantissaToTokens } from 'utilities';

type TrimmedWithdrawFromVaiVaultInput = Omit<WithdrawFromVaiVaultInput, 'vaiVaultContract'>;
type Options = UseSendTransactionOptions<TrimmedWithdrawFromVaiVaultInput>;

const useWithdrawFromVaiVault = (options?: Options) => {
  const vaiVaultContract = useGetVaiVaultContract({
    passSigner: true,
  });

  const vai = useGetToken({
    symbol: 'VAI',
  });

  const { chainId } = useChainId();
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
      const { amountMantissa } = input;
      const accountAddress = await vaiVaultContract?.signer.getAddress();

      if (vai) {
        captureAnalyticEvent('Tokens withdrawn from VAI vault', {
          tokenAmountTokens: convertMantissaToTokens({
            token: vai,
            value: amountMantissa,
          }).toNumber(),
        });

        queryClient.invalidateQueries([
          FunctionKey.GET_BALANCE_OF,
          {
            chainId,
            accountAddress,
            tokenAddress: vai.address,
          },
        ]);

        // Invalidate cached vault data
        queryClient.invalidateQueries([
          FunctionKey.GET_BALANCE_OF,
          {
            chainId,
            accountAddress: vaiVaultContract?.address,
            tokenAddress: vai.address,
          },
        ]);
      }

      queryClient.invalidateQueries([
        FunctionKey.GET_VAI_VAULT_USER_INFO,
        {
          chainId,
          accountAddress,
        },
      ]);

      queryClient.invalidateQueries([
        FunctionKey.GET_TOKEN_BALANCES,
        {
          chainId,
          accountAddress,
        },
      ]);

      queryClient.invalidateQueries(FunctionKey.GET_VENUS_VAI_VAULT_DAILY_RATE);
    },
    options,
  });
};

export default useWithdrawFromVaiVault;
