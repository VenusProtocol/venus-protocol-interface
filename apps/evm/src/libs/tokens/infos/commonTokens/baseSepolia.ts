import cbbtcLogo from 'libs/tokens/img/underlyingTokens/cbbtc.svg';
import usdcLogo from 'libs/tokens/img/underlyingTokens/usdc.svg';
import wSuperOEthBLogo from 'libs/tokens/img/underlyingTokens/wSuperOEthB.svg';
import wethLogo from 'libs/tokens/img/underlyingTokens/weth.svg';
import wstEthLogo from 'libs/tokens/img/underlyingTokens/wstEth.svg';
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
    address: '0x0948001047A07e38F685f9a11ea1ddB16B234af9',
    decimals: 8,
    symbol: 'cbBTC',
    asset: cbbtcLogo,
  },
  {
    address: '0xFa264c13d657180e65245a9C3ac8d08b9F5Fc54D',
    decimals: 6,
    symbol: 'USDC',
    asset: usdcLogo,
  },
  {
    address: '0xE657EDb5579B82135a274E85187927C42E38C021',
    decimals: 18,
    symbol: 'XVS',
    asset: xvsLogo,
  },
  {
    address: '0x02B1136d9E223333E0083aeAB76bC441f230a033',
    decimals: 18,
    symbol: 'wsuperOETHb',
    asset: wSuperOEthBLogo,
  },
  {
    address: '0xAd69AA3811fE0EE7dBd4e25C4bae40e6422c76C8',
    decimals: 18,
    symbol: 'wstETH',
    asset: wstEthLogo,
  },
];
