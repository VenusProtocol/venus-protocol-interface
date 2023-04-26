import { Pool } from 'types';

import { assetData } from '__mocks__/models/asset';

export const poolData: Pool[] = [
  {
    comptrollerAddress: 'fake-comptroller-address-1',
    assets: assetData,
    name: 'Venus',
    description: 'Fake description 1',
    isIsolated: false,
    userSupplyBalanceCents: 123879865,
    userBorrowBalanceCents: 12333,
    userBorrowLimitCents: 192673,
  },
  {
    comptrollerAddress: 'fake-comptroller-address-2',
    assets: assetData,
    name: 'Metaverse',
    description: 'Fake description 2',
    isIsolated: true,
    userSupplyBalanceCents: 0,
    userBorrowBalanceCents: 0,
    userBorrowLimitCents: 0,
  },
  {
    comptrollerAddress: 'fake-comptroller-address-3',
    assets: assetData,
    name: 'Gaming',
    description: 'Fake description 3',
    isIsolated: true,
    userSupplyBalanceCents: 100000,
    userBorrowBalanceCents: 1000,
    userBorrowLimitCents: 2000,
  },
];
