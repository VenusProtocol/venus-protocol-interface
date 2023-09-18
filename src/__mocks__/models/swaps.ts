import BigNumber from 'bignumber.js';
import { ExactAmountInSwap, ExactAmountOutSwap } from 'types';

import { busd, xvs } from './tokens';

export const exactAmountInSwap: ExactAmountInSwap = {
  fromToken: xvs,
  fromTokenAmountSoldWei: new BigNumber('10000000000000000'),
  toToken: busd,
  minimumToTokenAmountReceivedWei: new BigNumber('20000000000000000'),
  expectedToTokenAmountReceivedWei: new BigNumber('30000000000000000'),
  direction: 'exactAmountIn',
  routePath: [xvs.address, busd.address],
  priceImpactPercentage: 0.001,
  exchangeRate: new BigNumber(2),
};

export const exactAmountOutSwap: ExactAmountOutSwap = {
  fromToken: xvs,
  expectedFromTokenAmountSoldWei: new BigNumber('20000000000000000'),
  maximumFromTokenAmountSoldWei: new BigNumber('30000000000000000'),
  toToken: busd,
  toTokenAmountReceivedWei: new BigNumber('10000000000000000'),
  direction: 'exactAmountOut',
  routePath: [xvs.address, busd.address],
  priceImpactPercentage: 0.001,
  exchangeRate: new BigNumber(2),
};
