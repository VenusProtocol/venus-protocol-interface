import cbbtcLogo from '../img/tokens/cbbtc.svg';
import usdcLogo from '../img/tokens/usdc.svg';
import wethLogo from '../img/tokens/weth.svg';
import xvsLogo from '../img/tokens/xvs.svg';
import type { Token } from '../types';
import { eth } from './nativeTokens';

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
];
