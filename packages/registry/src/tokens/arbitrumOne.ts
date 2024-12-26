import arbLogo from '../img/tokens/arb.svg';
import usdcLogo from '../img/tokens/usdc.svg';
import usdtLogo from '../img/tokens/usdt.svg';
import wbtcLogo from '../img/tokens/wbtc.svg';
import weEthLogo from '../img/tokens/weEth.svg';
import wethLogo from '../img/tokens/weth.svg';
import wstEthLogo from '../img/tokens/wstEth.svg';
import xvsLogo from '../img/tokens/xvs.svg';
import type { Token } from '../types';
import { eth } from './nativeTokens';

export const tokens: Token[] = [
  eth,
  {
    address: '0x912ce59144191c1204e64559fe8253a0e49e6548',
    decimals: 18,
    symbol: 'ARB',
    asset: arbLogo,
  },
  {
    address: '0x2f2a2543b76a4166549f7aab2e75bef0aefc5b0f',
    decimals: 8,
    symbol: 'WBTC',
    asset: wbtcLogo,
  },
  {
    address: '0x82af49447d8a07e3bd95bd0d56f35241523fbab1',
    decimals: 18,
    symbol: 'WETH',
    asset: wethLogo,
    tokenWrapped: eth,
  },
  {
    address: '0xaf88d065e77c8cc2239327c5edb3a432268e5831',
    decimals: 6,
    symbol: 'USDC',
    asset: usdcLogo,
  },
  {
    address: '0xfd086bc7cd5c481dcc9c85ebe478a1c0b69fcbb9',
    decimals: 6,
    symbol: 'USDT',
    asset: usdtLogo,
  },
  {
    address: '0xc1Eb7689147C81aC840d4FF0D298489fc7986d52',
    decimals: 18,
    symbol: 'XVS',
    asset: xvsLogo,
  },
  {
    address: '0x35751007a407ca6FEFfE80b3cB397736D2cf4dbe',
    decimals: 18,
    symbol: 'weETH',
    asset: weEthLogo,
  },
  {
    address: '0x5979D7b546E38E414F7E9822514be443A4800529',
    decimals: 18,
    symbol: 'wstETH',
    asset: wstEthLogo,
  },
];
