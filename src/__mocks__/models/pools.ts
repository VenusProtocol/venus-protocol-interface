import BigNumber from 'bignumber.js';
import { Pool } from 'types';

import { assetData } from '__mocks__/models/asset';

export const poolData: Pool[] = [
  {
    comptrollerAddress: 'fake-comptroller-address-1',
    assets: assetData,
    name: 'Venus',
    description: 'Fake description 1',
    isIsolated: false,
    userSupplyBalanceCents: new BigNumber(123879865),
    userBorrowBalanceCents: new BigNumber(12333),
    userBorrowLimitCents: new BigNumber(192673),
  },
  {
    comptrollerAddress: 'fake-comptroller-address-2',
    assets: assetData,
    name: 'Metaverse',
    description: 'Fake description 2',
    isIsolated: true,
    userSupplyBalanceCents: new BigNumber(0),
    userBorrowBalanceCents: new BigNumber(0),
    userBorrowLimitCents: new BigNumber(0),
  },
  {
    comptrollerAddress: 'fake-comptroller-address-3',
    assets: assetData,
    name: 'Gaming',
    description: 'Fake description 3',
    isIsolated: true,
    userSupplyBalanceCents: new BigNumber(100000),
    userBorrowBalanceCents: new BigNumber(1000),
    userBorrowLimitCents: new BigNumber(2000),
  },
];
