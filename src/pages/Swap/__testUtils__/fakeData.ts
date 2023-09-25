import BigNumber from 'bignumber.js';
import { ExactAmountInSwap, ExactAmountOutSwap } from 'types';
import { convertTokensToWei } from 'utilities';

import { FAKE_BNB_BALANCE_TOKENS, FAKE_BUSD_BALANCE_TOKENS } from '__mocks__/models/tokenBalances';
import { bnb, busd } from '__mocks__/models/tokens';

export const FAKE_BNB_BALANCE_WEI = convertTokensToWei({
  value: new BigNumber(FAKE_BNB_BALANCE_TOKENS),
  token: bnb,
});

export const FAKE_BUSD_BALANCE_WEI = convertTokensToWei({
  value: new BigNumber(FAKE_BUSD_BALANCE_TOKENS),
  token: busd,
});

export const fakeExactAmountInSwap: ExactAmountInSwap = {
  fromToken: bnb,
  fromTokenAmountSoldWei: FAKE_BNB_BALANCE_WEI,
  toToken: busd,
  minimumToTokenAmountReceivedWei: FAKE_BNB_BALANCE_WEI.multipliedBy(1.5),
  expectedToTokenAmountReceivedWei: FAKE_BNB_BALANCE_WEI.multipliedBy(2),
  direction: 'exactAmountIn',
  priceImpactPercentage: 0.001,
  routePath: [bnb.address, busd.address],
  exchangeRate: new BigNumber(2),
};

export const fakeExactAmountOutSwap: ExactAmountOutSwap = {
  fromToken: bnb,
  expectedFromTokenAmountSoldWei: FAKE_BUSD_BALANCE_WEI.multipliedBy(1.5),
  maximumFromTokenAmountSoldWei: FAKE_BUSD_BALANCE_WEI.multipliedBy(2),
  toToken: busd,
  toTokenAmountReceivedWei: FAKE_BUSD_BALANCE_WEI,
  direction: 'exactAmountOut',
  priceImpactPercentage: 0.001,
  routePath: [bnb.address, busd.address],
  exchangeRate: new BigNumber(2),
};
