import { queryClient } from 'clients/api';
import FunctionKey from 'constants/functionKey';
import { DEFAULT_SLIPPAGE_TOLERANCE_PERCENTAGE } from 'constants/swap';
import { type UseSendTransactionOptions, useSendTransaction } from 'hooks/useSendTransaction';
import { useAnalytics } from 'libs/analytics';
import { getContractAddress, swapRouterV2Abi } from 'libs/contracts';
import { VError } from 'libs/errors';
import { useAccountAddress, useChainId } from 'libs/wallet';
import type { ExactOutSwapQuote, SwapQuote, VToken } from 'types';
import { convertMantissaToTokens } from 'utilities';
import type { Account, Address, Chain, Hex, WriteContractParameters } from 'viem';

type SwapTokensAndRepayInput = {
  swapQuote: SwapQuote;
  vToken: VToken;
  repayFullLoan: boolean;
  poolComptrollerContractAddress: Address;
  poolName: string;
};

type Options = UseSendTransactionOptions<SwapTokensAndRepayInput>;

export const useSwapTokensAndRepay = (options?: Partial<Options>) => {
  const { chainId } = useChainId();
  const { captureAnalyticEvent } = useAnalytics();
  const { accountAddress } = useAccountAddress();

  return useSendTransaction({
    // @ts-ignore mixing payable and non-payable function calls messes up with the typing of
    // useSendTransaction
    fn: ({ swapQuote, vToken, repayFullLoan }: SwapTokensAndRepayInput) => {
      const swapRouterContractAddress = getContractAddress({
        name: 'SwapRouterV2',
        chainId,
      });

      if (!swapRouterContractAddress) {
        throw new VError({
          type: 'unexpected',
          code: 'somethingWentWrong',
        });
      }



      // 2. Repay full loan in BNBs using tokens
      if (
        repayFullLoan &&
        swapQuote.direction === 'exact-out' &&
        vToken.symbol === 'vBNB' && 
        !swapQuote.fromToken.tokenWrapped?.isNative &&
        swapQuote.toToken.tokenWrapped?.isNative
      ) {
        return {
          address: swapRouterContractAddress,
          abi: swapRouterV2Abi,
          functionName: 'swapAndRepayFull',
          args: [
            vToken.address, // vToken is vBNB
            swapQuote.fromToken.address,
            swapQuote.maximumFromTokenAmountSoldMantissa,
            swapQuote.callData,
          ],
        } as WriteContractParameters<
          typeof swapRouterV2Abi,
          'swapAndRepayFull',
          readonly [Address, Address, bigint, Hex],
          Chain,
          Account
        >;
      }



      // 6. Sell fromTokens to repay as many BNBs as possible → repay max BNBs
      if (
        swapQuote.direction === 'exact-in' &&
        vToken.symbol === 'vBNB' && 
        !swapQuote.fromToken.isNative &&
        swapQuote.toToken.isNative
      ) {
        return {
          address: swapRouterContractAddress,
          abi: swapRouterV2Abi,
          functionName: 'swapAndRepay',
          args: [
            vToken.address, // vToken is vBNB
            swapQuote.fromToken.address,
            swapQuote.fromTokenAmountSoldMantissa,
            swapQuote.minimumToTokenAmountReceivedMantissa,
            swapQuote.callData,
          ],
        } as WriteContractParameters<
          typeof swapRouterV2Abi,
          'swapAndRepay',
          readonly [Address, Address, bigint, bigint, Hex],
          Chain,
          Account
        >;
      }

      // 9. Repay BNBs by selling as few fromTokens as possible
      if (
        swapQuote.direction === 'exact-out' &&
        vToken.symbol === 'vBNB' &&
        !swapQuote.fromToken.isNative &&
        swapQuote.toToken.isNative
      ) {
        return {
          address: swapRouterContractAddress,
          abi: swapRouterV2Abi,
          functionName: 'swapAndRepayFull',
          args: [
            vToken.address, // vToken is vBNB
            swapQuote.fromToken.address,
            swapQuote.maximumFromTokenAmountSoldMantissa,
            swapQuote.callData,
          ],
        } as WriteContractParameters<
          typeof swapRouterV2Abi,
          'swapAndRepayFull',
          readonly [Address, Address, bigint, Hex],
          Chain,
          Account
        >;
      }

      // 1. Repay full loan in tokens using tokens
      if (
        repayFullLoan &&
        swapQuote.direction === 'exact-out' &&
        !swapQuote.fromToken.tokenWrapped?.isNative &&
        !swapQuote.toToken.tokenWrapped?.isNative
      ) {
        return {
          address: swapRouterContractAddress,
          abi: swapRouterV2Abi,
          functionName: 'swapAndRepayFull',
          args: [
            vToken.address,
            swapQuote.fromToken.address,
            swapQuote.maximumFromTokenAmountSoldMantissa,
            swapQuote.callData,
          ],
        } as WriteContractParameters<
          typeof swapRouterV2Abi,
          'swapAndRepayFull',
          readonly [Address, Address, bigint, Hex],
          Chain,
          Account
        >;
      }

      // 3. Repay full loan in tokens using BNBs
      if (
        repayFullLoan &&
        swapQuote.direction === 'exact-out' &&
        swapQuote.fromToken.tokenWrapped?.isNative &&
        !swapQuote.toToken.tokenWrapped?.isNative
      ) {
        return {
          address: swapRouterContractAddress,
          abi: swapRouterV2Abi,
          functionName: 'swapNativeAndRepayFull',
          args: [vToken.address, swapQuote.callData],
          value: swapQuote.maximumFromTokenAmountSoldMantissa,
        } as WriteContractParameters<
          typeof swapRouterV2Abi,
          'swapNativeAndRepayFull',
          readonly [Address, Hex],
          Chain,
          Account
        >;
      }

      // 4. Sell fromTokens to repay as many toTokens as possible → repay max toTokens
      if (
        swapQuote.direction === 'exact-in' &&
        !swapQuote.fromToken.tokenWrapped?.isNative &&
        !swapQuote.toToken.tokenWrapped?.isNative
      ) {
        return {
          address: swapRouterContractAddress,
          abi: swapRouterV2Abi,
          functionName: 'swapAndRepay',
          args: [
            vToken.address,
            swapQuote.fromToken.address,
            swapQuote.fromTokenAmountSoldMantissa,
            swapQuote.minimumToTokenAmountReceivedMantissa,
            swapQuote.callData,
          ],
        } as WriteContractParameters<
          typeof swapRouterV2Abi,
          'swapAndRepay',
          readonly [Address, Address, bigint, bigint, Hex],
          Chain,
          Account
        >;
      }

      // 5. Sell BNBs to repay as many toTokens as possible → repay max toTokens
      if (
        swapQuote.direction === 'exact-in' &&
        swapQuote.fromToken.tokenWrapped?.isNative &&
        !swapQuote.toToken.tokenWrapped?.isNative
      ) {
        return {
          address: swapRouterContractAddress,
          abi: swapRouterV2Abi,
          functionName: 'swapNativeAndRepay',
          args: [
            vToken.address,
            swapQuote.minimumToTokenAmountReceivedMantissa,
            swapQuote.callData,
          ],
          value: swapQuote.fromTokenAmountSoldMantissa,
        } as WriteContractParameters<
          typeof swapRouterV2Abi,
          'swapNativeAndRepay',
          readonly [Address, bigint, Hex],
          Chain,
          Account
        >;
      }

      // 7. Repay toTokens by selling as few fromTokens as possible
      if (
        swapQuote.direction === 'exact-out' &&
        !swapQuote.fromToken.tokenWrapped?.isNative &&
        !swapQuote.toToken.tokenWrapped?.isNative
      ) {
        return {
          address: swapRouterContractAddress,
          abi: swapRouterV2Abi,
          functionName: 'swapAndRepayFull',
          args: [
            vToken.address,
            swapQuote.fromToken.address, // TODO: supposed to be tokenIn, was: swapQuote.toTokenAmountReceivedMantissa,
            swapQuote.maximumFromTokenAmountSoldMantissa,
            swapQuote.callData,
          ],
        } as WriteContractParameters<
          typeof swapRouterV2Abi,
          'swapAndRepayFull',
          readonly [Address, Address, bigint, Hex],
          Chain,
          Account
        >;
      }

      // 8. Repay toTokens by selling as few BNBs as possible
      if (
        swapQuote.direction === 'exact-out' &&
        swapQuote.fromToken.tokenWrapped?.isNative &&
        !swapQuote.toToken.tokenWrapped?.isNative
      ) {
        return {
          address: swapRouterContractAddress,
          abi: swapRouterV2Abi,
          functionName: 'swapNativeAndRepayFull',
          args: [vToken.address, swapQuote.callData],
          value: swapQuote.maximumFromTokenAmountSoldMantissa,
        } as WriteContractParameters<
          typeof swapRouterV2Abi,
          'swapNativeAndRepayFull',
          readonly [Address, Hex],
          Chain,
          Account
        >;
      }

      throw new VError({
        type: 'unexpected',
        code: 'incorrectSwapInput',
      });
    },
    onConfirmed: async ({ input }) => {
      captureAnalyticEvent('Tokens swapped and repaid', {
        poolName: input.poolName,
        fromTokenSymbol: input.swapQuote.fromToken.symbol,
        fromTokenAmountTokens: convertMantissaToTokens({
          token: input.swapQuote.fromToken,
          value:
            input.swapQuote.direction === 'exact-in'
              ? input.swapQuote.fromTokenAmountSoldMantissa
              : (input.swapQuote as ExactOutSwapQuote).expectedFromTokenAmountSoldMantissa,
        }).toNumber(),
        toTokenSymbol: input.swapQuote.toToken.symbol,
        toTokenAmountTokens: convertMantissaToTokens({
          token: input.swapQuote.toToken,
          value:
            input.swapQuote.direction === 'exact-in'
              ? input.swapQuote.expectedToTokenAmountReceivedMantissa
              : (input.swapQuote as ExactOutSwapQuote).toTokenAmountReceivedMantissa,
        }).toNumber(),
        priceImpactPercentage: input.swapQuote.priceImpactPercentage,
        slippageTolerancePercentage: DEFAULT_SLIPPAGE_TOLERANCE_PERCENTAGE,
        repaidFullLoan: input.repayFullLoan,
      });

      queryClient.invalidateQueries({
        queryKey: [
          FunctionKey.GET_BALANCE_OF,
          {
            chainId,
            accountAddress,
            tokenAddress: input.swapQuote.fromToken.address,
          },
        ],
      });

      queryClient.invalidateQueries({
        queryKey: [
          FunctionKey.GET_BALANCE_OF,
          {
            chainId,
            accountAddress,
            tokenAddress: input.swapQuote.toToken.address,
          },
        ],
      });

      const swapRouterContractAddress = getContractAddress({
        name: 'SwapRouter',
        poolComptrollerContractAddress: input.poolComptrollerContractAddress,
        chainId,
      });

      queryClient.invalidateQueries({
        queryKey: [
          FunctionKey.GET_TOKEN_ALLOWANCE,
          {
            chainId,
            tokenAddress: input.swapQuote.fromToken.address,
            accountAddress,
            spenderAddress: swapRouterContractAddress,
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

      queryClient.invalidateQueries({ queryKey: [FunctionKey.GET_V_TOKEN_BALANCES_ALL] });
      queryClient.invalidateQueries({ queryKey: [FunctionKey.GET_POOLS] });
    },
    options,
  });
};
