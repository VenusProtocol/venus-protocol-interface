import { queryClient } from 'clients/api';
import FunctionKey from 'constants/functionKey';
import { DEFAULT_SLIPPAGE_TOLERANCE_PERCENTAGE } from 'constants/swap';
import { type UseSendTransactionOptions, useSendTransaction } from 'hooks/useSendTransaction';
import { useAnalytics } from 'libs/analytics';
import { getContractAddress, swapRouterAbi } from 'libs/contracts';
import { VError } from 'libs/errors';
import { useAccountAddress, useChainId } from 'libs/wallet';
import type { Swap, VToken } from 'types';
import { convertMantissaToTokens, generateTransactionDeadline } from 'utilities';
import type { Account, Address, Chain, WriteContractParameters } from 'viem';

type SwapTokensAndRepayInput = {
  swap: Swap;
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
    fn: ({
      swap,
      vToken,
      repayFullLoan,
      poolComptrollerContractAddress,
    }: SwapTokensAndRepayInput) => {
      const swapRouterContractAddress = getContractAddress({
        name: 'SwapRouter',
        poolComptrollerContractAddress: poolComptrollerContractAddress,
        chainId,
      });

      if (!swapRouterContractAddress) {
        throw new VError({
          type: 'unexpected',
          code: 'somethingWentWrong',
        });
      }

      const transactionDeadline = generateTransactionDeadline();

      // Repay full loan in tokens using tokens
      if (
        repayFullLoan &&
        swap.direction === 'exactAmountOut' &&
        !swap.fromToken.isNative &&
        !swap.toToken.isNative
      ) {
        return {
          address: swapRouterContractAddress,
          abi: swapRouterAbi,
          functionName: 'swapTokensForFullTokenDebtAndRepay',
          args: [
            vToken.address,
            BigInt(swap.maximumFromTokenAmountSoldMantissa.toFixed()),
            swap.routePath,
            transactionDeadline,
          ],
        } as WriteContractParameters<
          typeof swapRouterAbi,
          'swapTokensForFullTokenDebtAndRepay',
          readonly [Address, bigint, Address[], bigint],
          Chain,
          Account
        >;
      }

      // Repay full loan in BNBs using tokens
      if (
        repayFullLoan &&
        swap.direction === 'exactAmountOut' &&
        !swap.fromToken.isNative &&
        swap.toToken.isNative
      ) {
        return {
          address: swapRouterContractAddress,
          abi: swapRouterAbi,
          functionName: 'swapTokensForFullBNBDebtAndRepay',
          args: [
            BigInt(swap.maximumFromTokenAmountSoldMantissa.toFixed()),
            swap.routePath,
            transactionDeadline,
          ],
        } as WriteContractParameters<
          typeof swapRouterAbi,
          'swapTokensForFullBNBDebtAndRepay',
          readonly [bigint, Address[], bigint],
          Chain,
          Account
        >;
      }

      // Repay full loan in tokens using BNBs
      if (
        repayFullLoan &&
        swap.direction === 'exactAmountOut' &&
        swap.fromToken.isNative &&
        !swap.toToken.isNative
      ) {
        return {
          address: swapRouterContractAddress,
          abi: swapRouterAbi,
          functionName: 'swapBNBForFullTokenDebtAndRepay',
          args: [vToken.address, swap.routePath, transactionDeadline],
          value: BigInt(swap.maximumFromTokenAmountSoldMantissa.toFixed()),
        } as WriteContractParameters<
          typeof swapRouterAbi,
          'swapBNBForFullTokenDebtAndRepay',
          readonly [Address, Address[], bigint],
          Chain,
          Account
        >;
      }

      // Sell fromTokens to repay as many toTokens as possible
      if (
        swap.direction === 'exactAmountIn' &&
        !swap.fromToken.isNative &&
        !swap.toToken.isNative
      ) {
        return {
          address: swapRouterContractAddress,
          abi: swapRouterAbi,
          functionName: 'swapExactTokensForTokensAndRepay',
          args: [
            vToken.address,
            BigInt(swap.fromTokenAmountSoldMantissa.toFixed()),
            BigInt(swap.minimumToTokenAmountReceivedMantissa.toFixed()),
            swap.routePath,
            transactionDeadline,
          ],
        } as WriteContractParameters<
          typeof swapRouterAbi,
          'swapExactTokensForTokensAndRepay',
          readonly [Address, bigint, bigint, Address[], bigint],
          Chain,
          Account
        >;
      }

      // Sell BNBs to repay as many toTokens as possible
      if (swap.direction === 'exactAmountIn' && swap.fromToken.isNative && !swap.toToken.isNative) {
        return {
          address: swapRouterContractAddress,
          abi: swapRouterAbi,
          functionName: 'swapBNBForExactTokensAndRepay',
          args: [
            vToken.address,
            BigInt(swap.minimumToTokenAmountReceivedMantissa.toFixed()),
            swap.routePath,
            transactionDeadline,
          ],
          value: BigInt(swap.fromTokenAmountSoldMantissa.toFixed()),
        };
      }

      // Sell fromTokens to repay as many BNBs as possible
      if (swap.direction === 'exactAmountIn' && !swap.fromToken.isNative && swap.toToken.isNative) {
        return {
          address: swapRouterContractAddress,
          abi: swapRouterAbi,
          functionName: 'swapExactTokensForBNBAndRepay',
          args: [
            BigInt(swap.fromTokenAmountSoldMantissa.toFixed()),
            BigInt(swap.minimumToTokenAmountReceivedMantissa.toFixed()),
            swap.routePath,
            transactionDeadline,
          ],
        } as WriteContractParameters<
          typeof swapRouterAbi,
          'swapExactTokensForBNBAndRepay',
          readonly [bigint, bigint, Address[], bigint],
          Chain,
          Account
        >;
      }

      // Repay toTokens by selling as few fromTokens as possible
      if (
        swap.direction === 'exactAmountOut' &&
        !swap.fromToken.isNative &&
        !swap.toToken.isNative
      ) {
        return {
          address: swapRouterContractAddress,
          abi: swapRouterAbi,
          functionName: 'swapTokensForExactTokensAndRepay',
          args: [
            vToken.address,
            BigInt(swap.toTokenAmountReceivedMantissa.toFixed()),
            BigInt(swap.maximumFromTokenAmountSoldMantissa.toFixed()),
            swap.routePath,
            transactionDeadline,
          ],
        } as WriteContractParameters<
          typeof swapRouterAbi,
          'swapTokensForExactTokensAndRepay',
          readonly [Address, bigint, bigint, Address[], bigint],
          Chain,
          Account
        >;
      }

      // Repay toTokens by selling as few BNBs as possible
      if (
        swap.direction === 'exactAmountOut' &&
        swap.fromToken.isNative &&
        !swap.toToken.isNative
      ) {
        return {
          address: swapRouterContractAddress,
          abi: swapRouterAbi,
          functionName: 'swapBNBForExactTokensAndRepay',
          args: [
            vToken.address,
            BigInt(swap.toTokenAmountReceivedMantissa.toFixed()),
            swap.routePath,
            transactionDeadline,
          ],
          value: BigInt(swap.maximumFromTokenAmountSoldMantissa.toFixed()),
        } as WriteContractParameters<
          typeof swapRouterAbi,
          'swapBNBForExactTokensAndRepay',
          readonly [Address, bigint, Address[], bigint],
          Chain,
          Account
        >;
      }

      // Repay BNBs by selling as few fromTokens as possible
      if (
        swap.direction === 'exactAmountOut' &&
        !swap.fromToken.isNative &&
        swap.toToken.isNative
      ) {
        return {
          address: swapRouterContractAddress,
          abi: swapRouterAbi,
          functionName: 'swapTokensForExactBNBAndRepay',
          args: [
            BigInt(swap.toTokenAmountReceivedMantissa.toFixed()),
            BigInt(swap.maximumFromTokenAmountSoldMantissa.toFixed()),
            swap.routePath,
            transactionDeadline,
          ],
        } as WriteContractParameters<
          typeof swapRouterAbi,
          'swapTokensForExactBNBAndRepay',
          readonly [bigint, bigint, Address[], bigint],
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
        fromTokenSymbol: input.swap.fromToken.symbol,
        fromTokenAmountTokens: convertMantissaToTokens({
          token: input.swap.fromToken,
          value:
            input.swap.direction === 'exactAmountIn'
              ? input.swap.fromTokenAmountSoldMantissa
              : input.swap.expectedFromTokenAmountSoldMantissa,
        }).toNumber(),
        toTokenSymbol: input.swap.toToken.symbol,
        toTokenAmountTokens: convertMantissaToTokens({
          token: input.swap.toToken,
          value:
            input.swap.direction === 'exactAmountIn'
              ? input.swap.expectedToTokenAmountReceivedMantissa
              : input.swap.toTokenAmountReceivedMantissa,
        }).toNumber(),
        priceImpactPercentage: input.swap.priceImpactPercentage,
        slippageTolerancePercentage: DEFAULT_SLIPPAGE_TOLERANCE_PERCENTAGE,
        exchangeRate: input.swap.exchangeRate.toNumber(),
        repaidFullLoan: input.repayFullLoan,
      });

      queryClient.invalidateQueries({
        queryKey: [
          FunctionKey.GET_BALANCE_OF,
          {
            chainId,
            accountAddress,
            tokenAddress: input.swap.fromToken.address,
          },
        ],
      });

      queryClient.invalidateQueries({
        queryKey: [
          FunctionKey.GET_BALANCE_OF,
          {
            chainId,
            accountAddress,
            tokenAddress: input.swap.toToken.address,
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
            tokenAddress: input.swap.fromToken.address,
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
