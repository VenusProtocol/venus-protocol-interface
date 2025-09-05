import BigNumber from 'bignumber.js';

import type { Asset, Pool } from 'types';
import { assetData } from './asset';
import { eModeGroups } from './eModeGroup';

export const generateEModeGroup = ({
  groupAssets,
  id,
  name,
  description,
}: { groupAssets: Asset[]; id: number; name: string; description: string }) => ({
  id,
  name,
  description,
  assetSettings: groupAssets.map(a => ({
    vToken: a.vToken,
    collateralFactor: a.collateralFactor + 0.1,
    liquidationThresholdPercentage: a.liquidationThresholdPercentage + 12,
    liquidationPenaltyPercentage: a.liquidationThresholdPercentage - 50,
    liquidityCents: a.liquidityCents.toNumber(),
    liquidityTokens: a.cashTokens,
  })),
});

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
};

export const poolData: Pool[] = [legacyCorePool, isolatedPool];
