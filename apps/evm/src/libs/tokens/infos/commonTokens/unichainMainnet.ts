import uniLogo from 'libs/tokens/img/underlyingTokens/uni.svg';
import usdcLogo from 'libs/tokens/img/underlyingTokens/usdc.svg';
import wethLogo from 'libs/tokens/img/underlyingTokens/weth.svg';
import xvsLogo from 'libs/tokens/img/underlyingTokens/xvs.svg';
import type { Token } from 'types';
import { eth } from '../nativeTokens';

export const tokens: Token[] = [
  eth,
  {
    address: '0x4200000000000000000000000000000000000006',
    decimals: 18,
    symbol: 'WETH',
    asset: wethLogo,
    tokenWrapped: eth,
  },
  {
    address: '0x078D782b760474a361dDA0AF3839290b0EF57AD6',
    decimals: 6,
    symbol: 'USDC',
    asset: usdcLogo,
  },
  {
    address: '0x81908BBaad3f6fC74093540Ab2E9B749BB62aA0d',
    decimals: 18,
    symbol: 'XVS',
    asset: xvsLogo,
  },
  {
    address: '0x8f187aa05619a017077f5308904739877ce9ea21',
    decimals: 18,
    symbol: 'UNI',
    asset: uniLogo,
  },
];
