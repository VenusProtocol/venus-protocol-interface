import { type SwapTokensInput, queryClient, swapTokens } from 'clients/api';
import FunctionKey from 'constants/functionKey';
import { SLIPPAGE_TOLERANCE_PERCENTAGE } from 'constants/swap';
import { type UseSendTransactionOptions, useSendTransaction } from 'hooks/useSendTransaction';
import { useAnalytics } from 'libs/analytics';
import { useGetSwapRouterContract } from 'libs/contracts';
import { useChainId } from 'libs/wallet';
import { callOrThrow, convertMantissaToTokens } from 'utilities';
import type { Address } from 'viem';

type TrimmedSwapTokensInput = Omit<SwapTokensInput, 'swapRouterContract'>;
type Options = UseSendTransactionOptions<TrimmedSwapTokensInput>;

const useSwapTokens = (
  { poolComptrollerAddress }: { poolComptrollerAddress: Address },
  options?: Partial<Options>,
) => {
  const { chainId } = useChainId();
  const swapRouterContract = useGetSwapRouterContract({
    comptrollerContractAddress: poolComptrollerAddress,
    passSigner: true,
  });
  const { captureAnalyticEvent } = useAnalytics();

  return useSendTransaction({
    fnKey: [FunctionKey.SWAP_TOKENS],
    fn: (input: TrimmedSwapTokensInput) =>
      callOrThrow(
        {
          swapRouterContract,
        },
        params =>
          swapTokens({
            ...params,
            ...input,
          }),
      ),
    onConfirmed: async ({ input }) => {
      const { swap } = input;

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
        slippageTolerancePercentage: SLIPPAGE_TOLERANCE_PERCENTAGE,
        exchangeRate: swap.exchangeRate.toNumber(),
      });

      const accountAddress = await swapRouterContract?.signer.getAddress();

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
            spenderAddress: swapRouterContract?.address,
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

export default useSwapTokens;
