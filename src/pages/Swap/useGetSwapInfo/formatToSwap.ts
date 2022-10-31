import { Percent as PSPercent } from '@pancakeswap/sdk/dist/index.js';
import BigNumber from 'bignumber.js';
import { convertTokensToWei } from 'utilities';

import { SLIPPAGE_TOLERANCE_PERCENTAGE } from 'constants/swap';

import { Swap } from '../types';
import { FormatToSwapInput, FormatToSwapOutput } from './types';

// Format trade to swap info
const slippagePercent = new PSPercent(`${SLIPPAGE_TOLERANCE_PERCENTAGE * 10}`, 1000);

const formatToSwap = ({ trade, input }: FormatToSwapInput): FormatToSwapOutput => {
  if (input.direction === 'exactAmountIn') {
    const swap: Swap = {
      fromToken: input.fromToken,
      toToken: input.toToken,
      direction: 'exactAmountIn',
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
    };

    return swap;
  }

  // "exactAmountOut" case
  const swap: Swap = {
    fromToken: input.fromToken,
    toToken: input.toToken,
    direction: 'exactAmountOut',
    expectedFromTokenAmountSoldWei: convertTokensToWei({
      value: new BigNumber(trade.inputAmount.toFixed()),
      tokenId: input.fromToken.id,
    }),
    maximumFromTokenAmountSoldWei: convertTokensToWei({
      value: new BigNumber(trade.maximumAmountIn(slippagePercent).toFixed()),
      tokenId: input.fromToken.id,
    }),
    toTokenAmountReceivedWei: convertTokensToWei({
      value: new BigNumber(trade.outputAmount.toFixed()),
      tokenId: input.fromToken.id,
    }),
    exchangeRate: new BigNumber(trade.executionPrice.toFixed()),
  };

  return swap;
};

export default formatToSwap;
