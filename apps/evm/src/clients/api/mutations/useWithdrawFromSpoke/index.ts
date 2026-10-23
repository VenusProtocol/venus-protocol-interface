import type BigNumber from 'bignumber.js';
import { queryClient } from 'clients/api/queryClient';
import FunctionKey from 'constants/functionKey';
import { type UseSendTransactionOptions, useSendTransaction } from 'hooks/useSendTransaction';
import { useAnalytics } from 'libs/analytics';
import { spokeVTokenAbi } from 'libs/contracts';
import { VError } from 'libs/errors';
import { useAccountAddress, useChainId } from 'libs/wallet';
import type { VToken } from 'types';
import { convertMantissaToTokens } from 'utilities';

export type WithdrawFromSpokeInput = {
  vToken: VToken;
  poolName: string;
  amountMantissa: BigNumber;
  withdrawFullSupply: boolean;
  vTokenBalanceMantissa?: BigNumber;
};

type Options = UseSendTransactionOptions<WithdrawFromSpokeInput>;

export const useWithdrawFromSpoke = (options?: Partial<Options>) => {
  const { chainId } = useChainId();
  const { accountAddress } = useAccountAddress();
  const { captureAnalyticEvent } = useAnalytics();

  return useSendTransaction({
    fn: (input: WithdrawFromSpokeInput) => {
      if (!accountAddress || (input.withdrawFullSupply && !input.vTokenBalanceMantissa)) {
        throw new VError({
          type: 'unexpected',
          code: 'somethingWentWrong',
        });
      }

      if (input.withdrawFullSupply && input.vTokenBalanceMantissa) {
        return {
          abi: spokeVTokenAbi,
          address: input.vToken.address,
          functionName: 'redeem',
          args: [BigInt(input.vTokenBalanceMantissa.toFixed())],
        };
      }

      return {
        abi: spokeVTokenAbi,
        address: input.vToken.address,
        functionName: 'redeemUnderlying',
        args: [BigInt(input.amountMantissa.toFixed())],
      };
    },
    onConfirmed: ({ input }) => {
      captureAnalyticEvent('Tokens withdrawn', {
        poolName: input.poolName,
        tokenSymbol: input.vToken.underlyingToken.symbol,
        tokenAmountTokens: convertMantissaToTokens({
          token: input.vToken.underlyingToken,
          value: input.amountMantissa,
        }).toNumber(),
        withdrewFullSupply: input.withdrawFullSupply,
      });

      queryClient.invalidateQueries({
        queryKey: [FunctionKey.GET_SPOKE_POOLS],
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

      queryClient.invalidateQueries({
        queryKey: [
          FunctionKey.GET_BALANCE_OF,
          {
            chainId,
            accountAddress,
            tokenAddress: input.vToken.underlyingToken.address,
          },
        ],
      });

      queryClient.invalidateQueries({
        queryKey: [
          FunctionKey.GET_V_TOKEN_BALANCE,
          {
            accountAddress,
            vTokenAddress: input.vToken.address,
            chainId,
          },
        ],
      });
    },
    options,
  });
};
