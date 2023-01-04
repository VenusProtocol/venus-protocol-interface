import { Pool } from 'types';

import { assetData } from '__mocks__/models/asset';

export const poolData: Pool[] = [
  {
    comptrollerAddress: 'fake-comptroller-address-1',
    assets: [assetData[0]],
    name: 'Venus',
    riskRating: 'MINIMAL',
    description: 'Fake description 1',
    isIsolated: false,
    userSupplyBalanceCents: 123879865,
    userBorrowBalanceCents: 192673,
    userBorrowLimitCents: 12333,
  },
  {
    comptrollerAddress: 'fake-comptroller-address-2',
    assets: [assetData[1]],
    name: 'Metaverse',
    riskRating: 'VERY_HIGH',
    description: 'Fake description 2',
    isIsolated: true,
    userSupplyBalanceCents: 0,
    userBorrowBalanceCents: 0,
    userBorrowLimitCents: 0,
  },
  {
    comptrollerAddress: 'fake-comptroller-address-3',
    assets: [assetData[2]],
    name: 'Gaming',
    riskRating: 'MEDIUM',
    description: 'Fake description 3',
    isIsolated: true,
    userSupplyBalanceCents: 100000,
    userBorrowBalanceCents: 2000,
    userBorrowLimitCents: 1000,
  },
];
