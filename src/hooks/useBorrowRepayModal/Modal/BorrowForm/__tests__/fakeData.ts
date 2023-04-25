import BigNumber from 'bignumber.js';
import { Pool } from 'types';

import { poolData } from '__mocks__/models/pools';

export const fakePool: Pool = {
  ...poolData[0],
  userBorrowBalanceCents: 1000,
  userBorrowLimitCents: 100000,
};

export const fakeAsset = {
  ...fakePool.assets[0],
  liquidityCents: 1000000,
  userWalletBalanceTokens: new BigNumber(10000000),
  tokenPriceDollars: new BigNumber(1),
};
