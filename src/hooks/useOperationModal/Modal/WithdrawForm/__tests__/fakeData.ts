import BigNumber from 'bignumber.js';
import { Pool } from 'types';

import { poolData } from '__mocks__/models/pools';

export const fakePool: Pool = {
  ...poolData[0],
  userBorrowBalanceCents: new BigNumber(10),
  userBorrowLimitCents: new BigNumber(1000),
};

export const fakeAsset = fakePool.assets[0];
fakeAsset.userSupplyBalanceTokens = new BigNumber(1000);
fakeAsset.userWalletBalanceTokens = new BigNumber(10000000);
fakeAsset.tokenPriceCents = new BigNumber(100);

export const fakeVTokenBalanceWei = new BigNumber(10000000);
