import { Percent as PSPercent } from '@pancakeswap/sdk/dist/index.js';
import BigNumber from 'bignumber.js';

import { SLIPPAGE_TOLERANCE_PERCENTAGE } from 'constants/swap';
import type { Swap } from 'types';
import { convertTokensToMantissa } from 'utilities';

import type { FormatToSwapInput, FormatToSwapOutput } from './types';

// Format trade to swap info
const slippagePercent = new PSPercent(`${SLIPPAGE_TOLERANCE_PERCENTAGE * 10}`, 1000);

const formatToSwap = ({ trade, input }: FormatToSwapInput): FormatToSwapOutput => {
  const routePath = trade.route.path.map(token => token.address);

  if (input.direction === 'exactAmountIn') {
    const swap: Swap = {
      fromToken: input.fromToken,
      toToken: input.toToken,
      direction: 'exactAmountIn',
      routePath,
      priceImpactPercentage: +trade.priceImpact.toFixed(),
      fromTokenAmountSoldMantissa: convertTokensToMantissa({
        value: new BigNumber(trade.inputAmount.toFixed()),
        token: input.fromToken,
      }),
      expectedToTokenAmountReceivedMantissa: convertTokensToMantissa({
        value: new BigNumber(trade.outputAmount.toFixed()),
        token: input.toToken,
      }),
      minimumToTokenAmountReceivedMantissa: convertTokensToMantissa({
        value: new BigNumber(trade.minimumAmountOut(slippagePercent).toFixed()),
        token: input.toToken,
      }),
      exchangeRate: new BigNumber(trade.executionPrice.toFixed(input.toToken.decimals)).dp(
        input.toToken.decimals,
      ),
    };

    return swap;
  }

  // "exactAmountOut" case
  const swap: Swap = {
    fromToken: input.fromToken,
    toToken: input.toToken,
    direction: 'exactAmountOut',
    routePath,
    priceImpactPercentage: +trade.priceImpact.toFixed(),
    expectedFromTokenAmountSoldMantissa: convertTokensToMantissa({
      value: new BigNumber(trade.inputAmount.toFixed()),
      token: input.fromToken,
    }),
    maximumFromTokenAmountSoldMantissa: convertTokensToMantissa({
      value: new BigNumber(trade.maximumAmountIn(slippagePercent).toFixed()),
      token: input.fromToken,
    }),
    toTokenAmountReceivedMantissa: convertTokensToMantissa({
      value: new BigNumber(trade.outputAmount.toFixed()),
      token: input.toToken,
    }),
    exchangeRate: new BigNumber(trade.executionPrice.toFixed(input.toToken.decimals)).dp(
      input.toToken.decimals,
    ),
  };

  return swap;
};

export default formatToSwap;
