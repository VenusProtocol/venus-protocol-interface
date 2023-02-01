import { Pool } from 'types';

import { assetData } from '__mocks__/models/asset';

export const poolData: Pool[] = [
  {
    comptrollerAddress: 'fake-comptroller-address-1',
    assets: assetData,
    name: 'Venus',
    riskRating: 'MINIMAL',
    description: 'Fake description 1',
    isIsolated: false,
    safeBorrowLimitPercentage: 80,
    userSupplyBalanceCents: 123879865,
    userBorrowBalanceCents: 12333,
    userBorrowLimitCents: 192673,
  },
  {
    comptrollerAddress: 'fake-comptroller-address-2',
    assets: assetData,
    name: 'Metaverse',
    riskRating: 'VERY_HIGH',
    description: 'Fake description 2',
    isIsolated: true,
    safeBorrowLimitPercentage: 70,
    userSupplyBalanceCents: 0,
    userBorrowBalanceCents: 0,
    userBorrowLimitCents: 0,
  },
  {
    comptrollerAddress: 'fake-comptroller-address-3',
    assets: assetData,
    name: 'Gaming',
    riskRating: 'MEDIUM',
    description: 'Fake description 3',
    isIsolated: true,
    safeBorrowLimitPercentage: 85,
    userSupplyBalanceCents: 100000,
    userBorrowBalanceCents: 1000,
    userBorrowLimitCents: 2000,
  },
];
