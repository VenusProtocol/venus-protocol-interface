import { queryClient } from 'clients/api';
import FunctionKey from 'constants/functionKey';
import { useGetContractAddress } from 'hooks/useGetContractAddress';
import { type UseSendTransactionOptions, useSendTransaction } from 'hooks/useSendTransaction';
import { useAnalytics } from 'libs/analytics';
import { xvsVaultAbi } from 'libs/contracts';
import { VError } from 'libs/errors';
import { useGetToken } from 'libs/tokens';
import { useAccountAddress, useChainId } from 'libs/wallet';
import { convertMantissaToTokens } from 'utilities';
import type { Address } from 'viem';

type RequestWithdrawalFromXvsVaultInput = {
  rewardTokenAddress: Address;
  poolIndex: number;
  amountMantissa: bigint;
};

type Options = UseSendTransactionOptions<RequestWithdrawalFromXvsVaultInput>;

export const useRequestWithdrawalFromXvsVault = (options?: Partial<Options>) => {
  const { address: xvsVaultContractAddress } = useGetContractAddress({
    name: 'XvsVault',
  });
  const xvs = useGetToken({
    symbol: 'XVS',
  });

  const { chainId } = useChainId();
  const { accountAddress } = useAccountAddress();
  const { captureAnalyticEvent } = useAnalytics();

  return useSendTransaction({
    fn: ({ rewardTokenAddress, poolIndex, amountMantissa }: RequestWithdrawalFromXvsVaultInput) => {
      if (!xvsVaultContractAddress) {
        throw new VError({
          type: 'unexpected',
          code: 'somethingWentWrong',
        });
      }

      return {
        abi: xvsVaultAbi,
        address: xvsVaultContractAddress,
        functionName: 'requestWithdrawal',
        args: [rewardTokenAddress, BigInt(poolIndex), amountMantissa],
      };
    },
    onConfirmed: async ({ input }) => {
      const { poolIndex, amountMantissa } = input;

      if (xvs) {
        captureAnalyticEvent('Token withdrawal requested from XVS vault', {
          poolIndex: Number(poolIndex),
          rewardTokenSymbol: xvs.symbol,
          tokenAmountTokens: convertMantissaToTokens({
            token: xvs,
            value: amountMantissa,
          }).toNumber(),
        });

        // Invalidate cached user info
        queryClient.invalidateQueries({
          queryKey: [
            FunctionKey.GET_XVS_VAULT_USER_INFO,
            {
              chainId,
              accountAddress,
              rewardTokenAddress: xvs.address,
              poolIndex: Number(poolIndex),
            },
          ],
        });

        // Invalidate cached user withdrawal requests
        queryClient.invalidateQueries({
          queryKey: [
            FunctionKey.GET_XVS_VAULT_WITHDRAWAL_REQUESTS,
            {
              chainId,
              accountAddress,
              rewardTokenAddress: xvs.address,
              poolIndex: Number(poolIndex),
            },
          ],
        });
      }
    },
    options,
  });
};
