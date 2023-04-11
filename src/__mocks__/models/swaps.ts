import BigNumber from 'bignumber.js';
import { ExactAmountInSwap, ExactAmountOutSwap } from 'types';

import { PANCAKE_SWAP_TOKENS } from 'constants/tokens';

export const exactAmountInSwap: ExactAmountInSwap = {
  fromToken: PANCAKE_SWAP_TOKENS.cake,
  fromTokenAmountSoldWei: new BigNumber('10000000000000000'),
  toToken: PANCAKE_SWAP_TOKENS.busd,
  minimumToTokenAmountReceivedWei: new BigNumber('20000000000000000'),
  expectedToTokenAmountReceivedWei: new BigNumber('30000000000000000'),
  direction: 'exactAmountIn',
  routePath: [PANCAKE_SWAP_TOKENS.cake.address, PANCAKE_SWAP_TOKENS.busd.address],
  exchangeRate: new BigNumber(2),
};

export const exactAmountOutSwap: ExactAmountOutSwap = {
  fromToken: PANCAKE_SWAP_TOKENS.cake,
  expectedFromTokenAmountSoldWei: new BigNumber('20000000000000000'),
  maximumFromTokenAmountSoldWei: new BigNumber('30000000000000000'),
  toToken: PANCAKE_SWAP_TOKENS.busd,
  toTokenAmountReceivedWei: new BigNumber('10000000000000000'),
  direction: 'exactAmountOut',
  routePath: [PANCAKE_SWAP_TOKENS.cake.address, PANCAKE_SWAP_TOKENS.busd.address],
  exchangeRate: new BigNumber(2),
};
