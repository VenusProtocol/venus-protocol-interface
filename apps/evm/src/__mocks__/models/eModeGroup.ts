import type { Asset, EModeGroup } from 'types';
import { assetData } from './asset';

const generateEModeGroup = ({
  groupAssets,
  id,
  isIsolated,
  isActive,
  name,
}: {
  groupAssets: Asset[];
  id: number;
  name: string;
  isIsolated: boolean;
  isActive: boolean;
}): EModeGroup => ({
  id,
  name,
  isIsolated,
  isActive,
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
    isActive: true,
    groupAssets: assetData.slice(0, 3),
  }),
  generateEModeGroup({
    id: 1,
    name: 'DeFi',
    isIsolated: false,
    isActive: true,
    groupAssets: assetData.slice(2),
  }),
  generateEModeGroup({
    id: 2,
    name: '#ToTheMoon',
    isIsolated: true,
    isActive: true,
    groupAssets: assetData.slice(1, 2),
  }),
  generateEModeGroup({
    id: 3,
    name: 'GameFi',
    isIsolated: false,
    isActive: false,
    groupAssets: assetData.slice(0, 2),
  }),
];
