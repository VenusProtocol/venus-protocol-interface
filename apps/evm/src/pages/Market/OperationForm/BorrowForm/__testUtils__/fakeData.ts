import BigNumber from 'bignumber.js';

import { poolData } from '__mocks__/models/pools';
import { weth } from '__mocks__/models/tokens';
import type { Asset, Pool } from 'types';

const fakeAsset: Asset = {
  ...poolData[0].assets[0],
  liquidityCents: new BigNumber(1000000),
  cashTokens: new BigNumber(10000),
  userWalletBalanceTokens: new BigNumber(10000000),
  tokenPriceCents: new BigNumber(100),
};

export const fakePool: Pool = {
  ...poolData[0],
  assets: [fakeAsset, ...poolData[0].assets.slice(1)],
  userBorrowBalanceCents: new BigNumber(1000),
  userBorrowLimitCents: new BigNumber(100000),
  userLiquidationThresholdCents: new BigNumber(110000),
};

export { fakeAsset };

export const fakeWethAsset: Asset = {
  ...fakeAsset,
  vToken: {
    ...fakeAsset.vToken,
    underlyingToken: weth,
  },
};
