import type BigNumber from 'bignumber.js';
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

type StakeInVaiVaultInput = {
  amountMantissa: BigNumber;
};

type Options = UseSendTransactionOptions<StakeInVaiVaultInput>;

export const useStakeInVaiVault = (options?: Partial<Options>) => {
  const { chainId } = useChainId();
  const { accountAddress } = useAccountAddress();
  const { address: vaiVaultContractAddress } = useGetContractAddress({
    name: 'VaiVault',
  });

  const vai = useGetToken({
    symbol: 'VAI',
  });

  const { captureAnalyticEvent } = useAnalytics();

  return useSendTransaction({
    fn: ({ amountMantissa }: StakeInVaiVaultInput) => {
      if (!vaiVaultContractAddress) {
        throw new VError({
          type: 'unexpected',
          code: 'somethingWentWrong',
        });
      }

      return {
        abi: vaiVaultAbi,
        address: vaiVaultContractAddress,
        functionName: 'deposit',
        args: [BigInt(amountMantissa.toFixed())],
      };
    },
    onConfirmed: async ({ input }) => {
      if (vai) {
        captureAnalyticEvent('Tokens staked in VAI vault', {
          tokenAmountTokens: convertMantissaToTokens({
            token: vai,
            value: input.amountMantissa,
          }).toNumber(),
        });

        // Invalidate cached user balance
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

        queryClient.invalidateQueries({
          queryKey: [
            FunctionKey.GET_TOKEN_ALLOWANCE,
            {
              chainId,
              tokenAddress: vai.address,
              accountAddress,
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

      // Invalidate cached user info, including pending reward
      queryClient.invalidateQueries({
        queryKey: [FunctionKey.GET_VAI_VAULT_USER_INFO, { chainId, accountAddress }],
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
