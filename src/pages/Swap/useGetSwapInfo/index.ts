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

import { SLIPPAGE_TOLERANCE_PERCENTAGE } from 'constants/swap';

import { Swap, SwapDirection } from '../types';

export interface UseGetSwapInfoInput {
  fromToken: Token;
  toToken: Token;
  direction: SwapDirection;
  fromTokenAmountTokens?: string;
  toTokenAmountTokens?: string;
}

const useGetSwapInfo = (input: UseGetSwapInfoInput): Swap | undefined =>
  useMemo(() => {
    // TODO: define pairs based on fromToken and toToken and fetch their data

  // Find the best trade based on pairs
  return useMemo(() => {
    let trade: PSTrade<PSCurrency, PSCurrency, PSTradeType> | undefined;

    // Handle "exactAmountIn" direction (sell an exact amount of fromTokens for
    // as many toTokens as possible)
    if (
      getPancakeSwapPairsData?.pairs &&
      input.direction === 'exactAmountIn' &&
      !!input.fromTokenAmountTokens
    ) {
      const fromTokenAmountWei = convertTokensToWei({
        value: new BigNumber(input.fromTokenAmountTokens),
        tokenId: input.fromToken.id,
      });

      const currencyAmountIn = PSCurrencyAmount.fromRawAmount(
        new PSToken(
          config.chainId,
          input.fromToken.address,
          input.fromToken.decimals,
          input.fromToken.symbol,
        ),
        fromTokenAmountWei.toFixed(),
      );

      return {
        fromToken: input.fromToken,
        toToken: input.toToken,
        exchangeRate,
        fromTokenAmountSoldWei: convertTokensToWei({
          value: new BigNumber(input.fromTokenAmountTokens),
          tokenId: input.fromToken.id,
        }),
        expectedToTokenAmountReceivedWei,
        minimumToTokenAmountReceivedWei,
        direction: 'exactAmountIn',
      };
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
        input.fromToken.address,
        input.fromToken.decimals,
        input.fromToken.symbol,
      );

      const toTokenAmountWei = convertTokensToWei({
        value: new BigNumber(input.toTokenAmountTokens),
        tokenId: input.toToken.id,
      });

      const currencyAmountOut = PSCurrencyAmount.fromRawAmount(
        new PSToken(
          config.chainId,
          input.toToken.address,
          input.toToken.decimals,
          input.toToken.symbol,
        ),
        toTokenAmountWei.toFixed(),
      );

      return {
        fromToken: input.fromToken,
        toToken: input.toToken,
        exchangeRate,
        expectedFromTokenAmountSoldWei,
        maximumFromTokenAmountSoldWei,
        toTokenAmountReceivedWei: convertTokensToWei({
          value: new BigNumber(input.toTokenAmountTokens),
          tokenId: input.toToken.id,
        }),
        direction: 'exactAmountOut',
      };
    }

    return (
      trade &&
      formatToSwap({
        input,
        trade,
      })
    );
  }, [getPancakeSwapPairsData?.pairs, input.fromTokenAmountTokens, input.toTokenAmountTokens]);
};

export default useGetSwapInfo;
