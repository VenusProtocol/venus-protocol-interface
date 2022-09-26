import { Pool } from 'types';

import { assetData } from '__mocks__/models/asset';

export const poolData: Pool[] = [
  {
    id: '1',
    assets: assetData,
    name: 'Venus',
    riskLevel: 'MINIMAL',
    description: 'Fake description 1',
    isIsolated: false,
  },
  {
    id: '2',
    assets: assetData,
    name: 'Metaverse',
    riskLevel: 'VERY_HIGH',
    description: 'Fake description 2',
    isIsolated: true,
  },
  {
    id: '3',
    assets: assetData,
    name: 'Gaming',
    riskLevel: 'MEDIUM',
    description: 'Fake description 3',
    isIsolated: true,
  },
];
