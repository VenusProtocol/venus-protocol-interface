import BigNumber from 'bignumber.js';

import { poolData } from '__mocks__/models/pools';
import { eth, weth } from '__mocks__/models/tokens';

import type { Asset, Pool, TokenBalance } from 'types';

const fakeUserBorrowBalanceTokens = new BigNumber(1000);

export const fakePool: Pool = {
  ...poolData[0],
  userBorrowBalanceCents: new BigNumber(10),
  userBorrowLimitCents: new BigNumber(1000),
  assets: poolData[0].assets.map((asset, index) =>
    index === 0
      ? {
          ...asset,
          userBorrowBalanceTokens: fakeUserBorrowBalanceTokens,
        }
      : asset,
  ),
};

export const fakeAsset: Asset = {
  ...fakePool.assets[0],
  userBorrowBalanceTokens: fakeUserBorrowBalanceTokens,
  userWalletBalanceTokens: new BigNumber(10000000),
  tokenPriceCents: new BigNumber(100),
};

export const fakeWethAsset: Asset = {
  ...fakeAsset,
  vToken: {
    ...fakeAsset.vToken,
    underlyingToken: weth,
  },
};

export const fakeEthTokenBalance: TokenBalance = {
  balanceMantissa: new BigNumber('1000000000000000000'),
  token: eth,
};

export const fakeWEthTokenBalance: TokenBalance = {
  balanceMantissa: new BigNumber('1000000000000000000'),
  token: weth,
};
