import {
  Currency as PSCurrency,
  CurrencyAmount as PSCurrencyAmount,
  Percent as PSPercent,
  Token as PSToken,
  Trade as PSTrade,
  TradeType as PSTradeType,
} from '@pancakeswap/sdk/dist/index.js';
import BigNumber from 'bignumber.js';
import { useMemo } from 'react';
import { Token } from 'types';
import { convertTokensToWei } from 'utilities';

import { useGetPairs } from 'clients/api';
import { SLIPPAGE_TOLERANCE_PERCENTAGE } from 'constants/swap';

import { Swap, SwapDirection } from '../types';
import useGetTokenCombinations from './useGetTokenCombinations';

export interface UseGetSwapInfoInput {
  fromToken: Token;
  toToken: Token;
  direction: SwapDirection;
  fromTokenAmountTokens?: string;
  toTokenAmountTokens?: string;
}

const useGetSwapInfo = (input: UseGetSwapInfoInput): Swap | undefined => {
  // Determine all possible token combination based on input tokens
  const tokenCombinations = useGetTokenCombinations({
    fromToken: input.fromToken,
    toToken: input.toToken,
  });

  // Fetch pair data
  // TODO: refresh request on every new block
  const { data: getPairsData } = useGetPairs({ tokenCombinations });

  // Find the best trade based on pairs
  return useMemo(() => {
    let trade: PSTrade<PSCurrency, PSCurrency, PSTradeType> | undefined;

    if (getPairsData?.pairs && !!input.fromTokenAmountTokens) {
      const fromTokenAmountWei = convertTokensToWei({
        value: new BigNumber(input.fromTokenAmountTokens),
        tokenId: input.fromToken.id,
      });

      const currencyAmountIn = PSCurrencyAmount.fromRawAmount(
        new PSToken(97, input.fromToken.address, input.fromToken.decimals, input.fromToken.symbol),
        fromTokenAmountWei.toFixed(),
      );

      // TODO: handle mainnet
      const currencyOut = new PSToken(
        97,
        input.toToken.address,
        input.toToken.decimals,
        input.toToken.symbol,
      );

      [trade] = PSTrade.bestTradeExactIn(getPairsData?.pairs, currencyAmountIn, currencyOut, {
        maxHops: 3,
        maxNumResults: 1,
      });
    }

    // TODO: handle bestTradeExactOut case

    if (trade) {
      // Format trade to swap info
      const slippagePercent = new PSPercent(`${SLIPPAGE_TOLERANCE_PERCENTAGE * 10}`, 1000);

      const swap: Swap = {
        fromToken: input.fromToken,
        toToken: input.toToken,
        fromTokenAmountSoldWei: convertTokensToWei({
          value: new BigNumber(trade.inputAmount.toFixed()),
          tokenId: input.fromToken.id,
        }),
        expectedToTokenAmountReceivedWei: convertTokensToWei({
          value: new BigNumber(trade.outputAmount.toFixed()),
          tokenId: input.fromToken.id,
        }),
        minimumToTokenAmountReceivedWei: convertTokensToWei({
          value: new BigNumber(trade.minimumAmountOut(slippagePercent).toFixed()),
          tokenId: input.fromToken.id,
        }),
        exchangeRate: new BigNumber(trade.executionPrice.toFixed()),
        direction: 'exactAmountIn',
      };

      return swap;
    }
  }, [getPairsData?.pairs, input.fromTokenAmountTokens, input.toTokenAmountTokens]);
};

export default useGetSwapInfo;
