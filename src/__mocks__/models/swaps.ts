import BigNumber from 'bignumber.js';
import { ExactAmountInSwap, ExactAmountOutSwap } from 'types';

import { SWAP_TOKENS } from 'constants/tokens';

export const exactAmountInSwap: ExactAmountInSwap = {
  fromToken: SWAP_TOKENS.cake,
  fromTokenAmountSoldWei: new BigNumber('10000000000000000'),
  toToken: SWAP_TOKENS.busd,
  minimumToTokenAmountReceivedWei: new BigNumber('20000000000000000'),
  expectedToTokenAmountReceivedWei: new BigNumber('30000000000000000'),
  direction: 'exactAmountIn',
  routePath: [SWAP_TOKENS.cake.address, SWAP_TOKENS.busd.address],
  priceImpactPercentage: 0.001,
  exchangeRate: new BigNumber(2),
};

export const exactAmountOutSwap: ExactAmountOutSwap = {
  fromToken: SWAP_TOKENS.cake,
  expectedFromTokenAmountSoldWei: new BigNumber('20000000000000000'),
  maximumFromTokenAmountSoldWei: new BigNumber('30000000000000000'),
  toToken: SWAP_TOKENS.busd,
  toTokenAmountReceivedWei: new BigNumber('10000000000000000'),
  direction: 'exactAmountOut',
  routePath: [SWAP_TOKENS.cake.address, SWAP_TOKENS.busd.address],
  priceImpactPercentage: 0.001,
  exchangeRate: new BigNumber(2),
};
