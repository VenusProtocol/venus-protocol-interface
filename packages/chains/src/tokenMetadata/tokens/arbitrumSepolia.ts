import tokenIconUrls from '../../generated/tokenIconUrls.json';
import type { Token } from '../../types';
import { eth } from '../nativeTokens';

export const tokens: Token[] = [
  eth,
  {
    address: '0x4371bb358aB5cC192E481543417D2F67b8781731',
    decimals: 18,
    symbol: 'ARB',
    asset: tokenIconUrls.arb,
  },
  {
    address: '0xFb8d93FD3Cf18386a5564bb5619cD1FdB130dF7D',
    decimals: 8,
    symbol: 'WBTC',
    asset: tokenIconUrls.wbtc,
  },
  {
    address: '0x980B62Da83eFf3D4576C647993b0c1D7faf17c73',
    decimals: 18,
    symbol: 'WETH',
    asset: tokenIconUrls.weth,
    tokenWrapped: eth,
  },
  {
    address: '0x86f096B1D970990091319835faF3Ee011708eAe8',
    decimals: 6,
    symbol: 'USDC',
    asset: tokenIconUrls.usdc,
  },
  {
    address: '0xf3118a17863996B9F2A073c9A66Faaa664355cf8',
    decimals: 6,
    symbol: 'USDT',
    asset: tokenIconUrls.usdt,
  },
  {
    address: '0x877Dc896e7b13096D3827872e396927BbE704407',
    decimals: 18,
    symbol: 'XVS',
    asset: tokenIconUrls.xvs,
  },
  {
    address: '0x243141DBff86BbB0a082d790fdC21A6ff615Fa34',
    decimals: 18,
    symbol: 'weETH',
    asset: tokenIconUrls.weEth,
  },
  {
    address: '0x4A9dc15aA6094eF2c7eb9d9390Ac1d71f9406fAE',
    decimals: 18,
    symbol: 'wstETH',
    asset: tokenIconUrls.wstEth,
  },
  {
    address: '0xbd3AAd064295dcA0f45fab4C6A5adFb0D23a19D2',
    decimals: 18,
    symbol: 'gmBTC/USDC',
    asset: tokenIconUrls.gmBtcUsdc,
  },
  {
    address: '0x0012875a7395a293Adfc9b5cDC2Cfa352C4cDcD3',
    decimals: 18,
    symbol: 'gmWETH/USDC',
    asset: tokenIconUrls.gmWEthUsdc,
  },
];
