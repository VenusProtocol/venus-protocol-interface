import {
  Currency as PSCurrency,
  CurrencyAmount as PSCurrencyAmount,
  Token as PSToken,
  Trade as PSTrade,
  TradeType as PSTradeType,
} from '@pancakeswap/sdk/dist/index.js';
import BigNumber from 'bignumber.js';
import { useMemo } from 'react';
import { convertTokensToWei } from 'utilities';

import { useGetPairs } from 'clients/api';

import formatToSwap from './formatToSwap';
import { UseFindBestSwapInput, UseFindBestSwapOutput } from './types';
import useGetTokenCombinations from './useGetTokenCombinations';

const useFindBestSwap = (input: UseFindBestSwapInput): UseFindBestSwapOutput => {
  // Determine all possible token combination based on input tokens
  const tokenCombinations = useGetTokenCombinations({
    fromToken: input.fromToken,
    toToken: input.toToken,
  });

  // Fetch pair data
  const { data: getPairsData } = useGetPairs({ tokenCombinations });

  // Find the best trade based on pairs
  return useMemo(() => {
    let trade: PSTrade<PSCurrency, PSCurrency, PSTradeType> | undefined;

    // Handle "exactAmountIn" direction (sell an exact amount of fromTokens for
    // as many toTokens as possible)
    if (
      getPairsData?.pairs &&
      input.direction === 'exactAmountIn' &&
      !!input.fromTokenAmountTokens
    ) {
      const fromTokenAmountWei = convertTokensToWei({
        value: new BigNumber(input.fromTokenAmountTokens),
        tokenId: input.fromToken.id,
      });

      const currencyAmountIn = PSCurrencyAmount.fromRawAmount(
        // TODO: handle mainnet
        new PSToken(97, input.fromToken.address, input.fromToken.decimals, input.fromToken.symbol),
        fromTokenAmountWei.toFixed(),
      );

      const currencyOut = new PSToken(
        // TODO: handle mainnet
        97,
        input.toToken.address,
        input.toToken.decimals,
        input.toToken.symbol,
      );

      // Find best trade
      [trade] = PSTrade.bestTradeExactIn(getPairsData?.pairs, currencyAmountIn, currencyOut, {
        maxHops: 3,
        maxNumResults: 1,
      });
    }

    // Handle "exactAmountOut" direction (sell as few fromTokens as possible for
    // a fixed amount of toTokens)
    if (
      getPairsData?.pairs &&
      input.direction === 'exactAmountOut' &&
      !!input.toTokenAmountTokens
    ) {
      const currencyIn = new PSToken(
        // TODO: handle mainnet
        97,
        input.fromToken.address,
        input.fromToken.decimals,
        input.fromToken.symbol,
      );

      const toTokenAmountWei = convertTokensToWei({
        value: new BigNumber(input.toTokenAmountTokens),
        tokenId: input.toToken.id,
      });

      const currencyAmountOut = PSCurrencyAmount.fromRawAmount(
        // TODO: handle mainnet
        new PSToken(97, input.toToken.address, input.toToken.decimals, input.toToken.symbol),
        toTokenAmountWei.toFixed(),
      );

      // Find best trade
      [trade] = PSTrade.bestTradeExactOut(getPairsData?.pairs, currencyIn, currencyAmountOut, {
        maxHops: 3,
        maxNumResults: 1,
      });
    }

    return (
      trade &&
      formatToSwap({
        input,
        trade,
      })
    );
  }, [getPairsData?.pairs, input.fromTokenAmountTokens, input.toTokenAmountTokens]);
};

export default useFindBestSwap;
