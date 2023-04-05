import BigNumber from 'bignumber.js';
import { Pool } from 'types';

import { poolData } from '__mocks__/models/pools';

export const fakePool: Pool = {
  ...poolData[0],
  userBorrowBalanceCents: 10,
  userBorrowLimitCents: 1000,
};

export const fakeAsset = fakePool.assets[0];
fakeAsset.userBorrowBalanceTokens = new BigNumber(1000);
fakeAsset.userWalletBalanceTokens = new BigNumber(10000000);
fakeAsset.tokenPriceDollars = new BigNumber(1);
