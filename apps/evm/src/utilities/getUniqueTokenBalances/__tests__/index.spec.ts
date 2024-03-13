import BigNumber from 'bignumber.js';

import { bnb, eth, usdt } from '__mocks__/models/tokens';
import type { TokenBalance } from 'types';
import getUniqueTokenBalances from '..';

const fakeTokenBalanceBnb: TokenBalance = {
  token: bnb,
  balanceMantissa: new BigNumber('100'),
};

const fakeTokenBalanceUsdt: TokenBalance = {
  token: usdt,
  balanceMantissa: new BigNumber('100'),
};

const fakeTokenBalanceEth: TokenBalance = {
  token: eth,
  balanceMantissa: new BigNumber('100'),
};

describe('utilities/getUniqueTokenBalances', () => {
  it('should return token balances with no duplicates', () => {
    const tokenBalances = [
      fakeTokenBalanceEth,
      fakeTokenBalanceBnb,
      fakeTokenBalanceEth,
      fakeTokenBalanceEth,
      fakeTokenBalanceBnb,
      fakeTokenBalanceUsdt,
    ];
    const result = getUniqueTokenBalances(...tokenBalances);
    expect(result).toStrictEqual([fakeTokenBalanceEth, fakeTokenBalanceBnb, fakeTokenBalanceUsdt]);
  });
});
