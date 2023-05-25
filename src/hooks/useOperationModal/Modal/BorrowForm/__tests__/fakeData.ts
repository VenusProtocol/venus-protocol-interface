import BigNumber from 'bignumber.js';
import { Pool } from 'types';

import { poolData } from '__mocks__/models/pools';

export const fakePool: Pool = {
  ...poolData[0],
  userBorrowBalanceCents: new BigNumber(1000),
  userBorrowLimitCents: new BigNumber(100000),
};

export const fakeAsset = {
  ...fakePool.assets[0],
  liquidityCents: new BigNumber(1000000),
  userWalletBalanceTokens: new BigNumber(10000000),
  tokenPriceCents: new BigNumber(100),
};
