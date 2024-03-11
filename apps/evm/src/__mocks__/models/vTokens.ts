import type { VToken } from 'types';

import { bnb, busd, luna, usdc, usdt, ust, weth, xvs } from './tokens';

export const vXvs: VToken = {
  address: '0x6d6F697e34145Bb95c54E77482d97cc261Dc237E',
  decimals: 8,
  symbol: 'vXVS',
  underlyingToken: xvs,
};

export const vBnb: VToken = {
  address: '0x2E7222e51c0f6e98610A1543Aa3836E092CDe62c',
  decimals: 8,
  symbol: 'vBNB',
  underlyingToken: bnb,
};

export const vUsdc: VToken = {
  address: '0xD5C4C2e2facBEB59D0216D0595d63FcDc6F9A1a7',
  decimals: 8,
  symbol: 'vUSDC',
  underlyingToken: usdc,
};

export const vUsdt: VToken = {
  address: '0xb7526572FFE56AB9D7489838Bf2E18e3323b441A',
  decimals: 8,
  symbol: 'vUSDT',
  underlyingToken: usdt,
};

export const vBusd: VToken = {
  address: '0x08e0A5575De71037aE36AbfAfb516595fE68e5e4',
  decimals: 8,
  symbol: 'vBUSD',
  underlyingToken: busd,
};

export const vUst: VToken = {
  address: '0xF206af85BC2761c4F876d27Bd474681CfB335EfA',
  decimals: 8,
  symbol: 'vUST',
  underlyingToken: ust,
};

export const vLuna: VToken = {
  address: '0x9C3015191d39cF1930F92EB7e7BCbd020bCA286a',
  decimals: 8,
  symbol: 'vLUNA',
  underlyingToken: luna,
};

export const vWeth: VToken = {
  address: '0xc2931B1fEa69b6D6dA65a50363A8D75d285e4da9',
  decimals: 8,
  symbol: 'vWETH',
  underlyingToken: weth,
};

export default [vXvs, vBnb, vUsdc, vUsdt, vBusd, vUst, vLuna];
