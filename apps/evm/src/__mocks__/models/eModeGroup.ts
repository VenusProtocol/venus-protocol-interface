import type { Asset, EModeGroup } from 'types';
import { assetData } from './asset';

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

export const eModeGroups: EModeGroup[] = [
  generateEModeGroup({
    id: 0,
    name: 'Stablecoins',
    description: 'This block contains the assets of this category',
    groupAssets: assetData.slice(0, 3),
  }),
  generateEModeGroup({
    id: 1,
    name: 'DeFi',
    description: 'This block contains the assets of this category',
    groupAssets: assetData.slice(2, 4),
  }),
  generateEModeGroup({
    id: 2,
    name: '#ToTheMoon',
    description: 'This block contains the assets of this category',
    groupAssets: assetData.slice(5, 8),
  }),
];
