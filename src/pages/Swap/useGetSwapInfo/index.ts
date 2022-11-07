import {
  Currency as PSCurrency,
  CurrencyAmount as PSCurrencyAmount,
  Token as PSToken,
  Trade as PSTrade,
  TradeType as PSTradeType,
} from '@pancakeswap/sdk/dist/index.js';
import BigNumber from 'bignumber.js';
import config from 'config';
import { useMemo } from 'react';
import { convertTokensToWei } from 'utilities';

import { useGetPancakeSwapPairs } from 'clients/api';

import formatToSwap from './formatToSwap';
import { SwapError, UseGetSwapInfoInput, UseGetSwapInfoOutput } from './types';
import useGetTokenCombinations from './useGetTokenCombinations';
import wrapToken from './wrapToken';

export * from './types';

const useGetSwapInfo = (input: UseGetSwapInfoInput): UseGetSwapInfoOutput => {
  // Determine all possible token combinations based on input and base trade
  // tokens
  const tokenCombinations = useGetTokenCombinations({
    fromToken: input.fromToken,
    toToken: input.toToken,
  });

  // Fetch pair data
  const { data: getPancakeSwapPairsData } = useGetPancakeSwapPairs({ tokenCombinations });

  // Find the best trade based on pairs
  return useMemo(() => {
    let trade: PSTrade<PSCurrency, PSCurrency, PSTradeType> | undefined;
    let error: SwapError | undefined;

    const wrappedFromToken = wrapToken(input.fromToken);
    const wrappedToToken = wrapToken(input.toToken);

    // Return no trade if user is trying to wrap or unwrap BNB/wBNB
    if (wrappedFromToken.address === wrappedToToken.address) {
      return {
        swap: undefined,
        error: 'WRAPPING_UNWRAPPING_UNSUPPORTED',
      };
    }

    // Handle "exactAmountIn" direction (sell an exact amount of fromTokens for
    // as many toTokens as possible)
    if (
      getPancakeSwapPairsData?.pairs &&
      input.direction === 'exactAmountIn' &&
      !!input.fromTokenAmountTokens
    ) {
      const fromTokenAmountWei = convertTokensToWei({
        value: new BigNumber(input.fromTokenAmountTokens),
        token: wrappedFromToken,
      });

      const currencyAmountIn = PSCurrencyAmount.fromRawAmount(
        new PSToken(
          config.chainId,
          wrappedFromToken.address,
          wrappedFromToken.decimals,
          wrappedFromToken.symbol,
        ),
        fromTokenAmountWei.toFixed(),
      );

      const currencyOut = new PSToken(
        config.chainId,
        wrappedToToken.address,
        wrappedToToken.decimals,
        wrappedToToken.symbol,
      );

      // Find best trade
      [trade] = PSTrade.bestTradeExactIn(
        getPancakeSwapPairsData?.pairs,
        currencyAmountIn,
        currencyOut,
        {
          maxHops: 3,
          maxNumResults: 1,
        },
      );

      error = trade ? undefined : 'INSUFFICIENT_LIQUIDITY';
    }

    // Handle "exactAmountOut" direction (sell as few fromTokens as possible for
    // a fixed amount of toTokens)
    if (
      getPancakeSwapPairsData?.pairs &&
      input.direction === 'exactAmountOut' &&
      !!input.toTokenAmountTokens
    ) {
      const currencyIn = new PSToken(
        config.chainId,
        wrappedFromToken.address,
        wrappedFromToken.decimals,
        wrappedFromToken.symbol,
      );

      const toTokenAmountWei = convertTokensToWei({
        value: new BigNumber(input.toTokenAmountTokens),
        token: wrappedToToken,
      });

      const currencyAmountOut = PSCurrencyAmount.fromRawAmount(
        new PSToken(
          config.chainId,
          wrappedToToken.address,
          wrappedToToken.decimals,
          wrappedToToken.symbol,
        ),
        toTokenAmountWei.toFixed(),
      );

      // Find best trade
      [trade] = PSTrade.bestTradeExactOut(
        getPancakeSwapPairsData?.pairs,
        currencyIn,
        currencyAmountOut,
        {
          maxHops: 3,
          maxNumResults: 1,
        },
      );

      error = trade ? undefined : 'INSUFFICIENT_LIQUIDITY';
    }

    const swap =
      trade &&
      formatToSwap({
        input,
        trade,
      });

    return {
      swap,
      error,
    };
  }, [
    getPancakeSwapPairsData?.pairs,
    input.fromToken,
    input.toToken,
    input.fromTokenAmountTokens,
    input.toTokenAmountTokens,
  ]);
};

export default useGetSwapInfo;
