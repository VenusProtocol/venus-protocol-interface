import { VToken } from 'types';

import { bnb, busd } from './fakeTokens';

export const vBnb: VToken = {
  address: '0x2E7222e51c0f6e98610A1543Aa3836E092CDe62c',
  decimals: 8,
  symbol: 'vBNB',
  underlyingToken: bnb,
};

export const vBusd: VToken = {
  address: '0x08e0A5575De71037aE36AbfAfb516595fE68e5e4',
  decimals: 8,
  symbol: 'vBUSD',
  underlyingToken: busd,
};
