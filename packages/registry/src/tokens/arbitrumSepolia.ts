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
    address: '0x4371bb358aB5cC192E481543417D2F67b8781731',
    decimals: 18,
    symbol: 'ARB',
    asset: arbLogo,
  },
  {
    address: '0xFb8d93FD3Cf18386a5564bb5619cD1FdB130dF7D',
    decimals: 8,
    symbol: 'WBTC',
    asset: wbtcLogo,
  },
  {
    address: '0x980B62Da83eFf3D4576C647993b0c1D7faf17c73',
    decimals: 18,
    symbol: 'WETH',
    asset: wethLogo,
    tokenWrapped: eth,
  },
  {
    address: '0x86f096B1D970990091319835faF3Ee011708eAe8',
    decimals: 6,
    symbol: 'USDC',
    asset: usdcLogo,
  },
  {
    address: '0xf3118a17863996B9F2A073c9A66Faaa664355cf8',
    decimals: 6,
    symbol: 'USDT',
    asset: usdtLogo,
  },
  {
    address: '0x877Dc896e7b13096D3827872e396927BbE704407',
    decimals: 18,
    symbol: 'XVS',
    asset: xvsLogo,
  },
  {
    address: '0x243141DBff86BbB0a082d790fdC21A6ff615Fa34',
    decimals: 18,
    symbol: 'weETH',
    asset: weEthLogo,
  },
  {
    address: '0x4A9dc15aA6094eF2c7eb9d9390Ac1d71f9406fAE',
    decimals: 18,
    symbol: 'wstETH',
    asset: wstEthLogo,
  },
];
