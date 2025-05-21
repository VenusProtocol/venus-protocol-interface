import { queryClient } from 'clients/api';
import FunctionKey from 'constants/functionKey';
import { useGetContractAddress } from 'hooks/useGetContractAddress';
import { type UseSendTransactionOptions, useSendTransaction } from 'hooks/useSendTransaction';
import { useAnalytics } from 'libs/analytics';
import { vaiVaultAbi } from 'libs/contracts';
import { VError } from 'libs/errors';
import { useGetToken } from 'libs/tokens';
import { useAccountAddress, useChainId } from 'libs/wallet';
import { convertMantissaToTokens } from 'utilities';

type WithdrawFromVaiVaultInput = {
  amountMantissa: bigint;
};

type Options = UseSendTransactionOptions<WithdrawFromVaiVaultInput>;

export const useWithdrawFromVaiVault = (options?: Partial<Options>) => {
  const { address: vaiVaultContractAddress } = useGetContractAddress({
    name: 'VaiVault',
  });

  const vai = useGetToken({
    symbol: 'VAI',
  });

  const { chainId } = useChainId();
  const { accountAddress } = useAccountAddress();
  const { captureAnalyticEvent } = useAnalytics();

  return useSendTransaction({
    fn: ({ amountMantissa }: WithdrawFromVaiVaultInput) => {
      if (!vaiVaultContractAddress) {
        throw new VError({
          type: 'unexpected',
          code: 'somethingWentWrong',
        });
      }

      return {
        abi: vaiVaultAbi,
        address: vaiVaultContractAddress,
        functionName: 'withdraw',
        args: [amountMantissa],
      };
    },
    onConfirmed: async ({ input }) => {
      const { amountMantissa } = input;

      if (vai) {
        captureAnalyticEvent('Tokens withdrawn from VAI vault', {
          tokenAmountTokens: convertMantissaToTokens({
            token: vai,
            value: amountMantissa,
          }).toNumber(),
        });

        queryClient.invalidateQueries({
          queryKey: [
            FunctionKey.GET_BALANCE_OF,
            {
              chainId,
              accountAddress,
              tokenAddress: vai.address,
            },
          ],
        });

        // Invalidate cached vault data
        queryClient.invalidateQueries({
          queryKey: [
            FunctionKey.GET_BALANCE_OF,
            {
              chainId,
              accountAddress: vaiVaultContractAddress,
              tokenAddress: vai.address,
            },
          ],
        });
      }

      queryClient.invalidateQueries({
        queryKey: [
          FunctionKey.GET_VAI_VAULT_USER_INFO,
          {
            chainId,
            accountAddress,
          },
        ],
      });

      queryClient.invalidateQueries({
        queryKey: [
          FunctionKey.GET_TOKEN_BALANCES,
          {
            chainId,
            accountAddress,
          },
        ],
      });

      queryClient.invalidateQueries({ queryKey: [FunctionKey.GET_VENUS_VAI_VAULT_DAILY_RATE] });
    },
    options,
  });
};
