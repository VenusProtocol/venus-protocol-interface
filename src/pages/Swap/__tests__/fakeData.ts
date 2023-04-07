import BigNumber from 'bignumber.js';
import { ExactAmountInSwap, ExactAmountOutSwap } from 'types';
import { convertTokensToWei } from 'utilities';

import { FAKE_BNB_BALANCE_TOKENS, FAKE_BUSD_BALANCE_TOKENS } from '__mocks__/models/tokenBalances';
import { PANCAKE_SWAP_TOKENS } from 'constants/tokens';

export const FAKE_BNB_BALANCE_WEI = convertTokensToWei({
  value: new BigNumber(FAKE_BNB_BALANCE_TOKENS),
  token: PANCAKE_SWAP_TOKENS.bnb,
});

export const FAKE_BUSD_BALANCE_WEI = convertTokensToWei({
  value: new BigNumber(FAKE_BUSD_BALANCE_TOKENS),
  token: PANCAKE_SWAP_TOKENS.busd,
});

export const FAKE_CAKE_BALANCE_TOKENS = '30';
export const FAKE_CAKE_BALANCE_WEI = convertTokensToWei({
  value: new BigNumber(FAKE_CAKE_BALANCE_TOKENS),
  token: PANCAKE_SWAP_TOKENS.cake,
});

export const fakeExactAmountInSwap: ExactAmountInSwap = {
  fromToken: PANCAKE_SWAP_TOKENS.bnb,
  fromTokenAmountSoldWei: FAKE_BNB_BALANCE_WEI,
  toToken: PANCAKE_SWAP_TOKENS.busd,
  minimumToTokenAmountReceivedWei: FAKE_BNB_BALANCE_WEI.multipliedBy(1.5),
  expectedToTokenAmountReceivedWei: FAKE_BNB_BALANCE_WEI.multipliedBy(2),
  direction: 'exactAmountIn',
  routePath: [PANCAKE_SWAP_TOKENS.bnb.address, PANCAKE_SWAP_TOKENS.busd.address],
  exchangeRate: new BigNumber(2),
};

export const fakeExactAmountOutSwap: ExactAmountOutSwap = {
  fromToken: PANCAKE_SWAP_TOKENS.bnb,
  expectedFromTokenAmountSoldWei: FAKE_BUSD_BALANCE_WEI.multipliedBy(1.5),
  maximumFromTokenAmountSoldWei: FAKE_BUSD_BALANCE_WEI.multipliedBy(2),
  toToken: PANCAKE_SWAP_TOKENS.busd,
  toTokenAmountReceivedWei: FAKE_BUSD_BALANCE_WEI,
  direction: 'exactAmountOut',
  routePath: [PANCAKE_SWAP_TOKENS.bnb.address, PANCAKE_SWAP_TOKENS.busd.address],
  exchangeRate: new BigNumber(2),
};

export const fakeNonNativeSwap: ExactAmountInSwap = {
  fromToken: PANCAKE_SWAP_TOKENS.cake,
  fromTokenAmountSoldWei: FAKE_CAKE_BALANCE_WEI,
  toToken: PANCAKE_SWAP_TOKENS.busd,
  minimumToTokenAmountReceivedWei: FAKE_CAKE_BALANCE_WEI.multipliedBy(1.5),
  expectedToTokenAmountReceivedWei: FAKE_CAKE_BALANCE_WEI.multipliedBy(2),
  direction: 'exactAmountIn',
  routePath: [PANCAKE_SWAP_TOKENS.cake.address, PANCAKE_SWAP_TOKENS.busd.address],
  exchangeRate: new BigNumber(2),
};
