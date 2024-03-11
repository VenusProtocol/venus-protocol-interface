import BigNumber from 'bignumber.js';

import type { ExactAmountInSwap, ExactAmountOutSwap } from 'types';

import { busd, xvs } from './tokens';

export const exactAmountInSwap: ExactAmountInSwap = {
  fromToken: xvs,
  fromTokenAmountSoldMantissa: new BigNumber('10000000000000000'),
  toToken: busd,
  minimumToTokenAmountReceivedMantissa: new BigNumber('20000000000000000'),
  expectedToTokenAmountReceivedMantissa: new BigNumber('30000000000000000'),
  direction: 'exactAmountIn',
  routePath: [xvs.address, busd.address],
  priceImpactPercentage: 0.001,
  exchangeRate: new BigNumber(2),
};

export const exactAmountOutSwap: ExactAmountOutSwap = {
  fromToken: xvs,
  expectedFromTokenAmountSoldMantissa: new BigNumber('20000000000000000'),
  maximumFromTokenAmountSoldMantissa: new BigNumber('30000000000000000'),
  toToken: busd,
  toTokenAmountReceivedMantissa: new BigNumber('10000000000000000'),
  direction: 'exactAmountOut',
  routePath: [xvs.address, busd.address],
  priceImpactPercentage: 0.001,
  exchangeRate: new BigNumber(2),
};
