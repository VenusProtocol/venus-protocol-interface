import BigNumber from 'bignumber.js';

import type { ApiSpokeMarket } from '../../types';

export interface MarketRole {
  isLiquiditySide: boolean;
  isInactive: boolean;
}

export const getMarketRole = ({
  side,
  liquidationThresholdMantissa,
}: Pick<ApiSpokeMarket, 'side' | 'liquidationThresholdMantissa'>): MarketRole => {
  if (side !== 'inactive') {
    return { isLiquiditySide: side === 'liquidity', isInactive: false };
  }

  return {
    isLiquiditySide: new BigNumber(liquidationThresholdMantissa).isZero(),
    isInactive: true,
  };
};
