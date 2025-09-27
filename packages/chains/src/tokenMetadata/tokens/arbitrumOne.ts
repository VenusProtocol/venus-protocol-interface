import tokenIconUrls from '../../generated/tokenIconUrls.json';
import type { Token } from '../../types';
import { eth } from '../nativeTokens';

export const tokens: Token[] = [
  eth,
  {
    address: '0x912ce59144191c1204e64559fe8253a0e49e6548',
    decimals: 18,
    symbol: 'ARB',
    asset: tokenIconUrls.arb,
  },
  {
    address: '0x2f2a2543b76a4166549f7aab2e75bef0aefc5b0f',
    decimals: 8,
    symbol: 'WBTC',
    asset: tokenIconUrls.wbtc,
  },
  {
    address: '0x82af49447d8a07e3bd95bd0d56f35241523fbab1',
    decimals: 18,
    symbol: 'WETH',
    asset: tokenIconUrls.weth,
    tokenWrapped: eth,
  },
  {
    address: '0xaf88d065e77c8cc2239327c5edb3a432268e5831',
    decimals: 6,
    symbol: 'USDC',
    asset: tokenIconUrls.usdc,
  },
  {
    address: '0xfd086bc7cd5c481dcc9c85ebe478a1c0b69fcbb9',
    decimals: 6,
    symbol: 'USD₮0',
    asset: tokenIconUrls.usdt0,
  },
  {
    address: '0xc1Eb7689147C81aC840d4FF0D298489fc7986d52',
    decimals: 18,
    symbol: 'XVS',
    asset: tokenIconUrls.xvs,
  },
  {
    address: '0x35751007a407ca6FEFfE80b3cB397736D2cf4dbe',
    decimals: 18,
    symbol: 'weETH',
    asset: tokenIconUrls.weEth,
  },
  {
    address: '0x5979D7b546E38E414F7E9822514be443A4800529',
    decimals: 18,
    symbol: 'wstETH',
    asset: tokenIconUrls.wstEth,
  },
  {
    address: '0x47c031236e19d024b42f8AE6780E44A573170703',
    decimals: 18,
    symbol: 'gmBTC/USDC',
    asset: tokenIconUrls.gmBtcUsdc,
  },
  {
    address: '0x70d95587d40A2caf56bd97485aB3Eec10Bee6336',
    decimals: 18,
    symbol: 'gmWETH/USDC',
    asset: tokenIconUrls.gmWEthUsdc,
  },
];
