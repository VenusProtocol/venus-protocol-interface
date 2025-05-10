import { queryClient } from 'clients/api';
import FunctionKey from 'constants/functionKey';
import { type UseSendTransactionOptions, useSendTransaction } from 'hooks/useSendTransaction';
import { useAnalytics } from 'libs/analytics';
import { useGetXvsVaultContractAddress, xvsVaultAbi } from 'libs/contracts';
import { VError } from 'libs/errors';
import { useAccountAddress, useChainId } from 'libs/wallet';
import type { Token } from 'types';
import { convertMantissaToTokens } from 'utilities';

type StakeInXvsVaultInput = {
  stakedToken: Token;
  rewardToken: Token;
  amountMantissa: BigNumber;
  poolIndex: number;
};
type Options = UseSendTransactionOptions<StakeInXvsVaultInput>;

export const useStakeInXvsVault = (options?: Partial<Options>) => {
  const { chainId } = useChainId();
  const { captureAnalyticEvent } = useAnalytics();
  const { accountAddress } = useAccountAddress();
  const xvsVaultContractAddress = useGetXvsVaultContractAddress();

  return useSendTransaction({
    fn: ({ poolIndex, amountMantissa, rewardToken }: StakeInXvsVaultInput) => {
      if (!xvsVaultContractAddress) {
        throw new VError({
          type: 'unexpected',
          code: 'somethingWentWrong',
        });
      }

      return {
        abi: xvsVaultAbi,
        address: xvsVaultContractAddress,
        functionName: 'deposit',
        args: [rewardToken.address, BigInt(poolIndex), BigInt(amountMantissa.toFixed())],
      };
    },
    onConfirmed: async ({ input }) => {
      const { poolIndex, amountMantissa } = input;

      captureAnalyticEvent('Tokens staked in XVS vault', {
        poolIndex,
        rewardTokenSymbol: input.rewardToken.symbol,
        tokenAmountTokens: convertMantissaToTokens({
          token: input.stakedToken,
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
            rewardTokenAddress: input.rewardToken.address,
            poolIndex,
          },
        ],
      });

      // Invalidate cached user balance
      queryClient.invalidateQueries({
        queryKey: [
          FunctionKey.GET_BALANCE_OF,
          {
            chainId,
            accountAddress,
            tokenAddress: input.stakedToken.address,
          },
        ],
      });

      queryClient.invalidateQueries({
        queryKey: [
          FunctionKey.GET_TOKEN_ALLOWANCE,
          {
            chainId,
            tokenAddress: input.stakedToken.address,
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

      // Invalidate cached vault data
      queryClient.invalidateQueries({
        queryKey: [
          FunctionKey.GET_BALANCE_OF,
          {
            chainId,
            accountAddress: xvsVaultContractAddress,
            tokenAddress: input.stakedToken.address,
          },
        ],
      });

      queryClient.invalidateQueries({
        queryKey: [
          FunctionKey.GET_XVS_VAULT_POOL_INFOS,
          {
            chainId,
            rewardTokenAddress: input.rewardToken.address,
            poolIndex,
          },
        ],
      });

      // Invalidate cached Prime data
      queryClient.invalidateQueries({
        queryKey: [
          FunctionKey.GET_PRIME_STATUS,
          {
            chainId,
            accountAddress,
          },
        ],
      });

      queryClient.invalidateQueries({
        queryKey: [
          FunctionKey.GET_PRIME_TOKEN,
          {
            chainId,
            accountAddress,
          },
        ],
      });
    },
    options,
  });
};

export default useStakeInXvsVault;
