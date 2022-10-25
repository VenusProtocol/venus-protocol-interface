import BigNumber from 'bignumber.js';
import { useMemo } from 'react';
import { Token } from 'types';
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

    // TODO: determine best swap using pair data

    // TODO: get from fetched swap info or calculate using swap info
    const exchangeRate = new BigNumber('1.126783');

    if (input.direction === 'exactAmountIn' && !!input.fromTokenAmountTokens) {
      // TODO: get from fetched swap info
      const expectedToTokenAmountReceivedWei = new BigNumber('190287638578');
      // Calculate minimum received accepted according to slippage
      const minimumToTokenAmountReceivedWei = expectedToTokenAmountReceivedWei
        .multipliedBy(1 - SLIPPAGE_TOLERANCE_PERCENTAGE / 100)
        .dp(0);

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

    if (input.direction === 'exactAmountOut' && !!input.toTokenAmountTokens) {
      // TODO: get from fetched swap info
      const expectedFromTokenAmountSoldWei = new BigNumber('467312321');
      // Calculate maximum sold accepted according to slippage
      const maximumFromTokenAmountSoldWei = expectedFromTokenAmountSoldWei
        .multipliedBy(1 + SLIPPAGE_TOLERANCE_PERCENTAGE / 100)
        .dp(0);

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

    // Return undefined if a mandatory prop is missing
    return undefined;
  }, [
    input.direction,
    input.fromToken,
    input.fromTokenAmountTokens,
    input.toToken,
    input.toTokenAmountTokens,
  ]);

export default useGetSwapInfo;
