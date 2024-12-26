import usdcLogo from '../img/tokens/usdc.svg';
import usdcNativeLogo from '../img/tokens/usdcNative.svg';
import usdtLogo from '../img/tokens/usdt.svg';
import wbtcLogo from '../img/tokens/wbtc.svg';
import wethLogo from '../img/tokens/weth.svg';
import xvsLogo from '../img/tokens/xvs.svg';
import zkLogo from '../img/tokens/zk.svg';
import type { Token } from '../types';
import { eth } from './nativeTokens';

export const tokens: Token[] = [
  eth,
  {
    address: '0xD78ABD81a3D57712a3af080dc4185b698Fe9ac5A',
    decimals: 18,
    symbol: 'XVS',
    asset: xvsLogo,
  },
  {
    address: '0x5aea5775959fbc2557cc8789bc1bf90a239d9a91',
    decimals: 18,
    symbol: 'WETH',
    asset: wethLogo,
    tokenWrapped: eth,
  },
  {
    address: '0xbbeb516fb02a01611cbbe0453fe3c580d7281011',
    decimals: 8,
    symbol: 'WBTC',
    asset: wbtcLogo,
  },
  {
    address: '0x493257fd37edb34451f62edf8d2a0c418852ba4c',
    decimals: 6,
    symbol: 'USDT',
    asset: usdtLogo,
  },
  {
    address: '0x3355df6d4c9c3035724fd0e3914de96a5a83aaf4',
    decimals: 6,
    symbol: 'USDC.e',
    asset: usdcLogo,
  },
  {
    address: '0x1d17CBcF0D6D143135aE902365D2E5e2A16538D4',
    decimals: 6,
    symbol: 'USDC',
    asset: usdcNativeLogo,
  },
  {
    address: '0x5a7d6b2f92c77fad6ccabd7ee0624e64907eaf3e',
    decimals: 18,
    symbol: 'ZK',
    asset: zkLogo,
  },
];
