import crvLogo from 'packages/tokens/img/crv.svg';
import crvUsdLogo from 'packages/tokens/img/crvUsd.svg';
import usdcLogo from 'packages/tokens/img/usdc.svg';
import usdtLogo from 'packages/tokens/img/usdt.svg';
import wbtcLogo from 'packages/tokens/img/wbtc.svg';
import wethLogo from 'packages/tokens/img/weth.svg';
import xvsLogo from 'packages/tokens/img/xvs.svg';
import { Token } from 'types';

export const tokens: Token[] = [
  {
    address: '0x92A2928f5634BEa89A195e7BeCF0f0FEEDAB885b',
    decimals: 8,
    symbol: 'WBTC',
    asset: wbtcLogo,
  },
  {
    address: '0x700868CAbb60e90d77B6588ce072d9859ec8E281',
    decimals: 18,
    symbol: 'WETH',
    asset: wethLogo,
  },
  {
    address: '0x8d412FD0bc5d826615065B931171Eed10F5AF266',
    decimals: 6,
    symbol: 'USDT',
    asset: usdtLogo,
  },
  {
    address: '0x772d68929655ce7234C8C94256526ddA66Ef641E',
    decimals: 6,
    symbol: 'USDC',
    asset: usdcLogo,
  },
  {
    address: '0x2c78EF7eab67A6e0C9cAa6f2821929351bdDF3d3',
    decimals: 18,
    symbol: 'CRV',
    asset: crvLogo,
  },
  {
    address: '0x36421d873abCa3E2bE6BB3c819C0CF26374F63b6',
    decimals: 18,
    symbol: 'crvUSD',
    asset: crvUsdLogo,
  },
  {
    address: '0xdb633c11d3f9e6b8d17ac2c972c9e3b05da59bf9',
    decimals: 18,
    symbol: 'XVS',
    asset: xvsLogo,
  },
];
