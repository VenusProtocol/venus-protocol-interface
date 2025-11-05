import BigNumber from 'bignumber.js';

import type { Pool } from 'types';
import { assetData } from './asset';
import { eModeGroups } from './eModeGroup';
import { vai } from './tokens';

export const legacyCorePool: Pool = {
  comptrollerAddress: '0x94d1820b2d1c7c7452a163983dc888cec546b77d',
  assets: assetData,
  name: 'Venus',
  isIsolated: false,
  eModeGroups: eModeGroups,
  userSupplyBalanceCents: new BigNumber(123879865),
  userBorrowBalanceCents: new BigNumber(12333),
  userBorrowLimitCents: new BigNumber(192673),
  userLiquidationThresholdCents: new BigNumber(192673),
  userHealthFactor: 15.62,
  userYearlyEarningsCents: new BigNumber(36500),
  vai: {
    token: vai,
    tokenPriceCents: new BigNumber(100),
    borrowAprPercentage: new BigNumber(1.34),
    userBorrowBalanceTokens: new BigNumber(10),
    userBorrowBalanceCents: new BigNumber(1000),
  },
};

export const isolatedPool: Pool = {
  comptrollerAddress: '0x10b57706ad2345e590c2ea4dc02faef0d9f5b08b',
  assets: assetData,
  name: 'Metaverse',
  isIsolated: true,
  eModeGroups: [],
  userSupplyBalanceCents: new BigNumber(0),
  userBorrowBalanceCents: new BigNumber(0),
  userBorrowLimitCents: new BigNumber(0),
  userLiquidationThresholdCents: new BigNumber(0),
  userHealthFactor: Number.POSITIVE_INFINITY,
  userYearlyEarningsCents: new BigNumber(0),
};

export const poolData: Pool[] = [legacyCorePool, isolatedPool];
