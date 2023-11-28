import BigNumber from 'bignumber.js';

import { poolData } from '__mocks__/models/pools';

import { Pool } from 'types';

export const fakePool: Pool = {
  ...poolData[0],
};

export const fakeAsset = {
  ...fakePool.assets[0],
  supplyCapTokens: new BigNumber(10000),
  supplyBalanceTokens: new BigNumber(1100),
  userSupplyBalanceTokens: new BigNumber(1000),
  userWalletBalanceTokens: new BigNumber(10000000),
  tokenPriceCents: new BigNumber(100),
};
