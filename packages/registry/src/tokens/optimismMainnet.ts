import opLogo from '@registry/img/tokens/op.svg';
import usdcLogo from '@registry/img/tokens/usdc.svg';
import usdtLogo from '@registry/img/tokens/usdt.svg';
import wbtcLogo from '@registry/img/tokens/wbtc.svg';
import wethLogo from '@registry/img/tokens/weth.svg';
import xvsLogo from '@registry/img/tokens/xvs.svg';
import type { Token } from '@registry/types';
import { eth } from './nativeTokens';

export const tokens: Token[] = [
  eth,
  {
    address: '0x4a971e87ad1F61f7f3081645f52a99277AE917cF',
    decimals: 18,
    symbol: 'XVS',
    asset: xvsLogo,
  },
  {
    address: '0x4200000000000000000000000000000000000042',
    decimals: 18,
    symbol: 'OP',
    asset: opLogo,
  },
  {
    address: '0x68f180fcCe6836688e9084f035309E29Bf0A2095',
    decimals: 8,
    symbol: 'WBTC',
    asset: wbtcLogo,
  },
  {
    address: '0x4200000000000000000000000000000000000006',
    decimals: 18,
    symbol: 'WETH',
    asset: wethLogo,
    tokenWrapped: eth,
  },
  {
    address: '0x94b008aA00579c1307B0EF2c499aD98a8ce58e58',
    decimals: 6,
    symbol: 'USDT',
    asset: usdtLogo,
  },
  {
    address: '0x0b2c639c533813f4aa9d7837caf62653d097ff85',
    decimals: 6,
    symbol: 'USDC',
    asset: usdcLogo,
  },
];
