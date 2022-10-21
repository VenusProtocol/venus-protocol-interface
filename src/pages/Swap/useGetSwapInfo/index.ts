import BigNumber from 'bignumber.js';
import { useMemo } from 'react';
import { Token } from 'types';
import { convertTokensToWei } from 'utilities';

// TODO: move to global constants
export const SLIPPAGE_TOLERANCE_PERCENTAGE = 0.5;

export interface UseGetSwapInfoInput {
  fromToken: Token;
  toToken: Token;
  direction: 'exactAmountIn' | 'exactAmountOut';
  fromTokenAmountTokens?: string;
  toTokenAmountTokens?: string;
}

interface SwapBase {
  fromToken: Token;
  toToken: Token;
  exchangeRate: BigNumber;
  direction: 'exactAmountIn' | 'exactAmountOut';
}

export interface ExactAmountInSwap extends SwapBase {
  fromTokenAmountSoldWei: BigNumber;
  minimumToTokenAmountReceivedWei: BigNumber;
  direction: 'exactAmountIn';
}

export interface ExactAmountOutSwap extends SwapBase {
  maximumFromTokenAmountSoldWei: BigNumber;
  toTokenAmountReceivedWei: BigNumber;
  direction: 'exactAmountOut';
}

export type Swap = ExactAmountInSwap | ExactAmountOutSwap;

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
