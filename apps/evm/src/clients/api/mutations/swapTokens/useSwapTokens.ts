import { queryClient } from 'clients/api';
import FunctionKey from 'constants/functionKey';
import { SLIPPAGE_TOLERANCE_PERCENTAGE } from 'constants/swap';
import { type UseSendTransactionOptions, useSendTransaction } from 'hooks/useSendTransaction';
import { useAnalytics } from 'libs/analytics';
import { useGetZeroXSequenceExchangeContractAddress } from 'libs/contracts';
import { useChainId, useSigner } from 'libs/wallet';
import type { Swap } from 'types';
import { callOrThrow, convertMantissaToTokens } from 'utilities';
import { swapTokens } from '.';

type SwapTokensInput = { swap: Swap };
type Options = UseSendTransactionOptions<SwapTokensInput>;

export const useSwapTokens = (options?: Options) => {
  const { chainId } = useChainId();
  const { captureAnalyticEvent } = useAnalytics();
  const { signer } = useSigner();
  const zeroXExchangeContractAddress = useGetZeroXSequenceExchangeContractAddress();

  return useSendTransaction({
    fnKey: [FunctionKey.SWAP_TOKENS],
    fn: ({ swap }: SwapTokensInput) =>
      callOrThrow(
        {
          signer,
          zeroXExchangeContractAddress,
        },
        params => swapTokens({ ...params, swap }),
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
        routePath: swap.routePath,
      });

      const accountAddress = await signer?.getAddress();

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
            spenderAddress: zeroXExchangeContractAddress,
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
      queryClient.invalidateQueries({ queryKey: [FunctionKey.GET_MAIN_MARKETS] });
      queryClient.invalidateQueries({ queryKey: [FunctionKey.GET_LEGACY_POOL] });
      queryClient.invalidateQueries({ queryKey: [FunctionKey.GET_ISOLATED_POOLS] });
    },
    options,
  });
};
