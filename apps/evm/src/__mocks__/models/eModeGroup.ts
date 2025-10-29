import type { Asset, EModeGroup } from 'types';
import { assetData } from './asset';

const generateEModeGroup = ({
  groupAssets,
  id,
  isIsolated,
  name,
}: { groupAssets: Asset[]; id: number; name: string; isIsolated: boolean }): EModeGroup => ({
  id,
  name,
  isIsolated,
  assetSettings: groupAssets.map(a => ({
    vToken: a.vToken,
    collateralFactor: a.userCollateralFactor + 0.1,
    liquidationThresholdPercentage: a.userLiquidationThresholdPercentage + 12,
    liquidationPenaltyPercentage: a.userLiquidationThresholdPercentage - 50,
    isBorrowable: a.isBorrowable,
  })),
});

export const eModeGroups: EModeGroup[] = [
  generateEModeGroup({
    id: 0,
    name: 'Stablecoins',
    isIsolated: false,
    groupAssets: assetData.slice(0, 3),
  }),
  generateEModeGroup({
    id: 1,
    name: 'DeFi',
    isIsolated: false,
    groupAssets: assetData.slice(2),
  }),
  generateEModeGroup({
    id: 2,
    name: '#ToTheMoon',
    isIsolated: true,
    groupAssets: assetData.slice(1, 2),
  }),
];
