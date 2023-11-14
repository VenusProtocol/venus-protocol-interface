import BigNumber from 'bignumber.js';
import { ExactAmountInSwap, ExactAmountOutSwap } from 'types';
import { convertTokensToMantissa } from 'utilities';

import { FAKE_BNB_BALANCE_TOKENS, FAKE_BUSD_BALANCE_TOKENS } from '__mocks__/models/tokenBalances';
import { bnb, busd } from '__mocks__/models/tokens';

export const FAKE_BNB_BALANCE_MANTISSA = convertTokensToMantissa({
  value: new BigNumber(FAKE_BNB_BALANCE_TOKENS),
  token: bnb,
});

export const FAKE_BUSD_BALANCE_MANTISSA = convertTokensToMantissa({
  value: new BigNumber(FAKE_BUSD_BALANCE_TOKENS),
  token: busd,
});

export const fakeExactAmountInSwap: ExactAmountInSwap = {
  fromToken: bnb,
  fromTokenAmountSoldMantissa: FAKE_BNB_BALANCE_MANTISSA,
  toToken: busd,
  minimumToTokenAmountReceivedMantissa: FAKE_BNB_BALANCE_MANTISSA.multipliedBy(1.5),
  expectedToTokenAmountReceivedMantissa: FAKE_BNB_BALANCE_MANTISSA.multipliedBy(2),
  direction: 'exactAmountIn',
  priceImpactPercentage: 0.001,
  routePath: [bnb.address, busd.address],
  exchangeRate: new BigNumber(2),
};

export const fakeExactAmountOutSwap: ExactAmountOutSwap = {
  fromToken: bnb,
  expectedFromTokenAmountSoldMantissa: FAKE_BUSD_BALANCE_MANTISSA.multipliedBy(1.5),
  maximumFromTokenAmountSoldMantissa: FAKE_BUSD_BALANCE_MANTISSA.multipliedBy(2),
  toToken: busd,
  toTokenAmountReceivedMantissa: FAKE_BUSD_BALANCE_MANTISSA,
  direction: 'exactAmountOut',
  priceImpactPercentage: 0.001,
  routePath: [bnb.address, busd.address],
  exchangeRate: new BigNumber(2),
};
