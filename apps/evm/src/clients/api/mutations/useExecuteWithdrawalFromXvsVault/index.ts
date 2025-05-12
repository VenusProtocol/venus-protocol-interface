import { queryClient } from 'clients/api';
import FunctionKey from 'constants/functionKey';
import { type UseSendTransactionOptions, useSendTransaction } from 'hooks/useSendTransaction';
import { useAnalytics } from 'libs/analytics';
import { useGetXvsVaultContractAddress, xvsVaultAbi } from 'libs/contracts';
import { VError } from 'libs/errors';
import { useGetToken } from 'libs/tokens';
import { useAccountAddress, useChainId } from 'libs/wallet';
import type { Token } from 'types';
import type { Address } from 'viem';

type ExecuteWithdrawalFromXvsVaultInput = {
  rewardTokenAddress: Address;
  poolIndex: number;
};

type Options = UseSendTransactionOptions<ExecuteWithdrawalFromXvsVaultInput>;

export const useExecuteWithdrawalFromXvsVault = (
  { stakedToken }: { stakedToken: Token },
  options?: Partial<Options>,
) => {
  const { chainId } = useChainId();
  const xvsVaultContractAddress = useGetXvsVaultContractAddress();
  const { accountAddress } = useAccountAddress();

  const xvs = useGetToken({
    symbol: 'XVS',
  });

  const { captureAnalyticEvent } = useAnalytics();

  return useSendTransaction({
    fn: ({ rewardTokenAddress, poolIndex }: ExecuteWithdrawalFromXvsVaultInput) => {
      if (!xvsVaultContractAddress) {
        throw new VError({
          type: 'unexpected',
          code: 'somethingWentWrong',
        });
      }

      return {
        abi: xvsVaultAbi,
        address: xvsVaultContractAddress,
        functionName: 'executeWithdrawal',
        args: [rewardTokenAddress, BigInt(poolIndex)],
      };
    },
    onConfirmed: async ({ input }) => {
      const { poolIndex } = input;

      if (xvs) {
        captureAnalyticEvent('Token withdrawals executed from XVS vault', {
          poolIndex,
          rewardTokenSymbol: xvs.symbol,
        });

        // Invalidate cached user info
        queryClient.invalidateQueries({
          queryKey: [
            FunctionKey.GET_XVS_VAULT_USER_INFO,
            {
              chainId,
              accountAddress,
              rewardTokenAddress: xvs.address,
              poolIndex,
            },
          ],
        });

        // Invalidate cached user withdrawal requests
        queryClient.invalidateQueries({
          queryKey: [
            FunctionKey.GET_XVS_VAULT_WITHDRAWAL_REQUESTS,
            {
              chainId,
              rewardTokenAddress: xvs.address,
              poolIndex,
              accountAddress,
            },
          ],
        });

        queryClient.invalidateQueries({
          queryKey: [
            FunctionKey.GET_XVS_VAULT_POOL_INFOS,
            {
              chainId,
              rewardTokenAddress: xvs.address,
              poolIndex,
            },
          ],
        });
      }

      // Invalidate cached user balance
      queryClient.invalidateQueries({
        queryKey: [
          FunctionKey.GET_BALANCE_OF,
          {
            chainId,
            accountAddress,
            tokenAddress: stakedToken.address,
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

      // Invalidate cached vault data
      queryClient.invalidateQueries({
        queryKey: [
          FunctionKey.GET_BALANCE_OF,
          {
            chainId,
            accountAddress: xvsVaultContractAddress,
            tokenAddress: stakedToken.address,
          },
        ],
      });
    },
    options,
  });
};
