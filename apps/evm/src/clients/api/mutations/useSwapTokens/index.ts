import { queryClient } from 'clients/api';
import FunctionKey from 'constants/functionKey';
import { DEFAULT_SLIPPAGE_TOLERANCE_PERCENTAGE } from 'constants/swap';
import { type UseSendTransactionOptions, useSendTransaction } from 'hooks/useSendTransaction';
import { useAnalytics } from 'libs/analytics';
import { getContractAddress, swapRouterAbi } from 'libs/contracts';
import { VError } from 'libs/errors';
import { useAccountAddress, useChainId } from 'libs/wallet';
import type { Swap } from 'types';
import { convertMantissaToTokens, generateTransactionDeadline } from 'utilities';
import type { Account, Address, Chain, WriteContractParameters } from 'viem';

type SwapTokensInput = {
  swap: Swap;
  poolComptrollerContractAddress: Address;
};
type Options = UseSendTransactionOptions<SwapTokensInput>;

export const useSwapTokens = (options?: Partial<Options>) => {
  const { chainId } = useChainId();
  const { accountAddress } = useAccountAddress();
  const { captureAnalyticEvent } = useAnalytics();

  return useSendTransaction({
    // @ts-ignore mixing payable and non-payable function calls messes up with the typing of
    // useSendTransaction
    fn: ({ swap, poolComptrollerContractAddress }: SwapTokensInput) => {
      const swapRouterContractAddress = getContractAddress({
        chainId,
        name: 'SwapRouter',
        poolComptrollerContractAddress: poolComptrollerContractAddress,
      });

      if (!accountAddress || !swapRouterContractAddress) {
        throw new VError({
          type: 'unexpected',
          code: 'somethingWentWrong',
        });
      }

      const transactionDeadline = generateTransactionDeadline();

      // Sell fromTokens for as many toTokens as possible
      if (
        swap.direction === 'exactAmountIn' &&
        !swap.fromToken.isNative &&
        !swap.toToken.isNative
      ) {
        return {
          address: swapRouterContractAddress,
          abi: swapRouterAbi,
          functionName: 'swapExactTokensForTokens',
          args: [
            BigInt(swap.fromTokenAmountSoldMantissa.toFixed()),
            BigInt(swap.minimumToTokenAmountReceivedMantissa.toFixed()),
            swap.routePath,
            accountAddress,
            transactionDeadline,
          ],
        } as WriteContractParameters<
          typeof swapRouterAbi,
          'swapExactTokensForTokens',
          readonly [bigint, bigint, Address[], Address, bigint],
          Chain,
          Account
        >;
      }

      // Sell BNBs for as many toTokens as possible
      if (swap.direction === 'exactAmountIn' && swap.fromToken.isNative && !swap.toToken.isNative) {
        return {
          address: swapRouterContractAddress,
          abi: swapRouterAbi,
          functionName: 'swapExactBNBForTokens',
          args: [
            BigInt(swap.minimumToTokenAmountReceivedMantissa.toFixed()),
            swap.routePath,
            accountAddress,
            transactionDeadline,
          ],
          value: BigInt(swap.fromTokenAmountSoldMantissa.toFixed()),
        } as WriteContractParameters<
          typeof swapRouterAbi,
          'swapExactBNBForTokens',
          readonly [bigint, Address[], Address, bigint],
          Chain,
          Account
        >;
      }

      // Sell fromTokens for as many BNBs as possible
      if (swap.direction === 'exactAmountIn' && !swap.fromToken.isNative && swap.toToken.isNative) {
        return {
          address: swapRouterContractAddress,
          abi: swapRouterAbi,
          functionName: 'swapExactTokensForBNB',
          args: [
            BigInt(swap.fromTokenAmountSoldMantissa.toFixed()),
            BigInt(swap.minimumToTokenAmountReceivedMantissa.toFixed()),
            swap.routePath,
            accountAddress,
            transactionDeadline,
          ],
        } as WriteContractParameters<
          typeof swapRouterAbi,
          'swapExactTokensForBNB',
          readonly [bigint, bigint, Address[], Address, bigint],
          Chain,
          Account
        >;
      }

      // Buy toTokens by selling as few fromTokens as possible
      if (
        swap.direction === 'exactAmountOut' &&
        !swap.fromToken.isNative &&
        !swap.toToken.isNative
      ) {
        return {
          address: swapRouterContractAddress,
          abi: swapRouterAbi,
          functionName: 'swapTokensForExactTokens',
          args: [
            BigInt(swap.toTokenAmountReceivedMantissa.toFixed()),
            BigInt(swap.maximumFromTokenAmountSoldMantissa.toFixed()),
            swap.routePath,
            accountAddress,
            transactionDeadline,
          ],
        } as WriteContractParameters<
          typeof swapRouterAbi,
          'swapTokensForExactTokens',
          readonly [bigint, bigint, Address[], Address, bigint],
          Chain,
          Account
        >;
      }

      // Buy toTokens by selling as few BNBs as possible
      if (
        swap.direction === 'exactAmountOut' &&
        swap.fromToken.isNative &&
        !swap.toToken.isNative
      ) {
        return {
          address: swapRouterContractAddress,
          abi: swapRouterAbi,
          functionName: 'swapBNBForExactTokens',
          args: [
            BigInt(swap.toTokenAmountReceivedMantissa.toFixed()),
            swap.routePath,
            accountAddress,
            transactionDeadline,
          ],
          value: BigInt(swap.maximumFromTokenAmountSoldMantissa.toFixed()),
        } as WriteContractParameters<
          typeof swapRouterAbi,
          'swapBNBForExactTokens',
          readonly [bigint, Address[], Address, bigint],
          Chain,
          Account
        >;
      }

      // Buy BNBs by selling as few fromTokens as possible
      if (
        swap.direction === 'exactAmountOut' &&
        !swap.fromToken.isNative &&
        swap.toToken.isNative
      ) {
        return {
          address: swapRouterContractAddress,
          abi: swapRouterAbi,
          functionName: 'swapTokensForExactBNB',
          args: [
            BigInt(swap.toTokenAmountReceivedMantissa.toFixed()),
            BigInt(swap.maximumFromTokenAmountSoldMantissa.toFixed()),
            swap.routePath,
            accountAddress,
            transactionDeadline,
          ],
        } as WriteContractParameters<
          typeof swapRouterAbi,
          'swapTokensForExactBNB',
          readonly [bigint, bigint, Address[], Address, bigint],
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
      const { swap, poolComptrollerContractAddress } = input;

      const swapRouterContractAddress = getContractAddress({
        chainId,
        name: 'SwapRouter',
        poolComptrollerContractAddress: poolComptrollerContractAddress,
      });

      captureAnalyticEvent('Tokens swapped', {
        fromTokenSymbol: swap.fromToken.symbol,
        fromTokenAmountTokens: convertMantissaToTokens({
          token: swap.fromToken,
          value:
            swap.direction === 'exactAmountIn'
              ? swap.fromTokenAmountSoldMantissa
              : swap.expectedFromTokenAmountSoldMantissa,
        }).toNumber(),
        toTokenSymbol: swap.toToken.symbol,
        toTokenAmountTokens: convertMantissaToTokens({
          token: swap.toToken,
          value:
            swap.direction === 'exactAmountIn'
              ? swap.expectedToTokenAmountReceivedMantissa
              : swap.toTokenAmountReceivedMantissa,
        }).toNumber(),
        priceImpactPercentage: swap.priceImpactPercentage,
        slippageTolerancePercentage: DEFAULT_SLIPPAGE_TOLERANCE_PERCENTAGE,
        exchangeRate: swap.exchangeRate.toNumber(),
      });

      queryClient.invalidateQueries({
        queryKey: [
          FunctionKey.GET_BALANCE_OF,
          {
            chainId,
            accountAddress,
            tokenAddress: swap.fromToken.address,
          },
        ],
      });

      queryClient.invalidateQueries({
        queryKey: [
          FunctionKey.GET_BALANCE_OF,
          {
            chainId,
            accountAddress,
            tokenAddress: swap.toToken.address,
          },
        ],
      });

      queryClient.invalidateQueries({
        queryKey: [
          FunctionKey.GET_TOKEN_ALLOWANCE,
          {
            chainId,
            tokenAddress: swap.fromToken.address,
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
