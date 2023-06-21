import BigNumber from 'bignumber.js';
import { Pool } from 'types';

import { assetData } from '__mocks__/models/asset';
import { TESTNET_SWAP_ROUTERS } from 'constants/contracts/swapRouters';

const COMPTROLLER_ADDRESSES = Object.keys(TESTNET_SWAP_ROUTERS);

export const poolData: Pool[] = [
  {
    comptrollerAddress: COMPTROLLER_ADDRESSES[0],
    assets: assetData,
    name: 'Venus',
    description: 'Fake description 1',
    isIsolated: false,
    userSupplyBalanceCents: new BigNumber(123879865),
    userBorrowBalanceCents: new BigNumber(12333),
    userBorrowLimitCents: new BigNumber(192673),
  },
  {
    comptrollerAddress: COMPTROLLER_ADDRESSES[1],
    assets: assetData,
    name: 'Metaverse',
    description: 'Fake description 2',
    isIsolated: true,
    userSupplyBalanceCents: new BigNumber(0),
    userBorrowBalanceCents: new BigNumber(0),
    userBorrowLimitCents: new BigNumber(0),
  },
  {
    comptrollerAddress: COMPTROLLER_ADDRESSES[2],
    assets: assetData,
    name: 'Gaming',
    description: 'Fake description 3',
    isIsolated: true,
    userSupplyBalanceCents: new BigNumber(100000),
    userBorrowBalanceCents: new BigNumber(1000),
    userBorrowLimitCents: new BigNumber(2000),
  },
];
