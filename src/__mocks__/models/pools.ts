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
  },
  {
    comptrollerAddress: 'fake-comptroller-address-2',
    assets: assetData,
    name: 'Metaverse',
    riskRating: 'VERY_HIGH',
    description: 'Fake description 2',
    isIsolated: true,
  },
  {
    comptrollerAddress: 'fake-comptroller-address-3',
    assets: assetData,
    name: 'Gaming',
    riskRating: 'MEDIUM',
    description: 'Fake description 3',
    isIsolated: true,
  },
];
