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
    address: '0xcbB7C0000aB88B473b1f5aFd9ef808440eed33Bf',
    decimals: 8,
    symbol: 'cbBTC',
    asset: cbbtcLogo,
  },
  {
    address: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913',
    decimals: 6,
    symbol: 'USDC',
    asset: usdcLogo,
  },
  {
    address: '0xebB7873213c8d1d9913D8eA39Aa12d74cB107995',
    decimals: 18,
    symbol: 'XVS',
    asset: xvsLogo,
  },
];
