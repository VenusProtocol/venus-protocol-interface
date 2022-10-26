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

  console.log(getPairsData?.pairs);

  return useMemo(() => {
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
    input.toToken,
    input.fromTokenAmountTokens,
    input.toTokenAmountTokens,
  ]);
};

export default useGetSwapInfo;
