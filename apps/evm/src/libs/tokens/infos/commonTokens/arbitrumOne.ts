import { NATIVE_TOKEN_ADDRESS } from 'constants/address';
import arbLogo from 'libs/tokens/img/arb.svg';
import ethLogo from 'libs/tokens/img/eth.svg';
import usdcLogo from 'libs/tokens/img/usdc.svg';
import usdtLogo from 'libs/tokens/img/usdt.svg';
import wbtcLogo from 'libs/tokens/img/wbtc.svg';
import wethLogo from 'libs/tokens/img/weth.svg';
import xvsLogo from 'libs/tokens/img/xvs.svg';
import type { Token } from 'types';

const ethToken: Token = {
  address: NATIVE_TOKEN_ADDRESS,
  decimals: 18,
  symbol: 'ETH',
  asset: ethLogo,
  isNative: true,
};

export const tokens: Token[] = [
  ethToken,
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
    tokenWrapped: ethToken,
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
];
