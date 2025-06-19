import arbLogo from 'libs/tokens/img/underlyingTokens/arb.svg';
import gmBtcUsdcLogo from 'libs/tokens/img/underlyingTokens/gmBtcUsdc.svg';
import gmWEthUsdcLogo from 'libs/tokens/img/underlyingTokens/gmWEthUsdc.svg';
import usdcLogo from 'libs/tokens/img/underlyingTokens/usdc.svg';
import usdt0Logo from 'libs/tokens/img/underlyingTokens/usdt0.svg';
import wbtcLogo from 'libs/tokens/img/underlyingTokens/wbtc.svg';
import weEthLogo from 'libs/tokens/img/underlyingTokens/weEth.svg';
import wethLogo from 'libs/tokens/img/underlyingTokens/weth.svg';
import wstEthLogo from 'libs/tokens/img/underlyingTokens/wstEth.svg';
import xvsLogo from 'libs/tokens/img/underlyingTokens/xvs.svg';
import type { Token } from 'types';
import { eth } from '../nativeTokens';

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
    symbol: 'USD₮0',
    asset: usdt0Logo,
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
  {
    address: '0x47c031236e19d024b42f8AE6780E44A573170703',
    decimals: 18,
    symbol: 'gmBTC/USDC',
    asset: gmBtcUsdcLogo,
  },
  {
    address: '0x70d95587d40A2caf56bd97485aB3Eec10Bee6336',
    decimals: 18,
    symbol: 'gmWETH/USDC',
    asset: gmWEthUsdcLogo,
  },
];
