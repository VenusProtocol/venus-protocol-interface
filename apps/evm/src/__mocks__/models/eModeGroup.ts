import type { Asset, EModeGroup } from 'types';
import { assetData } from './asset';

const generateEModeGroup = ({
  groupAssets,
  id,
  name,
}: { groupAssets: Asset[]; id: number; name: string }): EModeGroup => ({
  id,
  name,
  assetSettings: groupAssets.map(a => ({
    vToken: a.vToken,
    collateralFactor: a.userCollateralFactor + 0.1,
    liquidationThresholdPercentage: a.userLiquidationThresholdPercentage + 12,
    liquidationPenaltyPercentage: a.userLiquidationThresholdPercentage - 50,
    liquidityCents: a.liquidityCents.toNumber(),
    liquidityTokens: a.cashTokens,
    isBorrowable: a.isBorrowable,
  })),
});

export const eModeGroups: EModeGroup[] = [
  generateEModeGroup({
    id: 0,
    name: 'Stablecoins',
    groupAssets: assetData.slice(0, 3),
  }),
  generateEModeGroup({
    id: 1,
    name: 'DeFi',
    groupAssets: assetData.slice(2, 4),
  }),
  generateEModeGroup({
    id: 2,
    name: '#ToTheMoon',
    groupAssets: assetData.slice(5, 8),
  }),
];
