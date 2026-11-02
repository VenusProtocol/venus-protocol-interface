import BigNumber from 'bignumber.js';

import type { LiquidityHub } from 'types';

export const convertVhTokensToUnderlying = ({
  vhTokens,
  liquidityHub,
}: {
  vhTokens: BigNumber;
  liquidityHub: LiquidityHub;
}) =>
  vhTokens
    .multipliedBy(liquidityHub.pricePerShare)
    .dp(liquidityHub.vhToken.underlyingToken.decimals, BigNumber.ROUND_DOWN);
