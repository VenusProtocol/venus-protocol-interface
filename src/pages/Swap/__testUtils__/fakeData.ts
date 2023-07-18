import BigNumber from 'bignumber.js';
import { ExactAmountInSwap, ExactAmountOutSwap } from 'types';
import { convertTokensToWei } from 'utilities';

import { FAKE_BNB_BALANCE_TOKENS, FAKE_BUSD_BALANCE_TOKENS } from '__mocks__/models/tokenBalances';
import { SWAP_TOKENS } from 'constants/tokens';

export const FAKE_BNB_BALANCE_WEI = convertTokensToWei({
  value: new BigNumber(FAKE_BNB_BALANCE_TOKENS),
  token: SWAP_TOKENS.bnb,
});

export const FAKE_BUSD_BALANCE_WEI = convertTokensToWei({
  value: new BigNumber(FAKE_BUSD_BALANCE_TOKENS),
  token: SWAP_TOKENS.busd,
});

export const FAKE_CAKE_BALANCE_TOKENS = '30';
export const FAKE_CAKE_BALANCE_WEI = convertTokensToWei({
  value: new BigNumber(FAKE_CAKE_BALANCE_TOKENS),
  token: SWAP_TOKENS.cake,
});

export const fakeExactAmountInSwap: ExactAmountInSwap = {
  fromToken: SWAP_TOKENS.bnb,
  fromTokenAmountSoldWei: FAKE_BNB_BALANCE_WEI,
  toToken: SWAP_TOKENS.busd,
  minimumToTokenAmountReceivedWei: FAKE_BNB_BALANCE_WEI.multipliedBy(1.5),
  expectedToTokenAmountReceivedWei: FAKE_BNB_BALANCE_WEI.multipliedBy(2),
  direction: 'exactAmountIn',
  priceImpactPercentage: 0.001,
  routePath: [SWAP_TOKENS.bnb.address, SWAP_TOKENS.busd.address],
  exchangeRate: new BigNumber(2),
};

export const fakeExactAmountOutSwap: ExactAmountOutSwap = {
  fromToken: SWAP_TOKENS.bnb,
  expectedFromTokenAmountSoldWei: FAKE_BUSD_BALANCE_WEI.multipliedBy(1.5),
  maximumFromTokenAmountSoldWei: FAKE_BUSD_BALANCE_WEI.multipliedBy(2),
  toToken: SWAP_TOKENS.busd,
  toTokenAmountReceivedWei: FAKE_BUSD_BALANCE_WEI,
  direction: 'exactAmountOut',
  priceImpactPercentage: 0.001,
  routePath: [SWAP_TOKENS.bnb.address, SWAP_TOKENS.busd.address],
  exchangeRate: new BigNumber(2),
};
