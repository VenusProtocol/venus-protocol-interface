import cbbtcLogo from 'libs/tokens/img/underlyingTokens/cbbtc.svg';
import uniLogo from 'libs/tokens/img/underlyingTokens/uni.svg';
import usdcLogo from 'libs/tokens/img/underlyingTokens/usdc.svg';
import usdtLogo from 'libs/tokens/img/underlyingTokens/usdt.svg';
import wethLogo from 'libs/tokens/img/underlyingTokens/weth.svg';
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
    address: '0x2979ef1676bb28192ac304173C717D7322b3b586',
    decimals: 8,
    symbol: 'cbBTC',
    asset: cbbtcLogo,
  },
  {
    address: '0xf16d4774893eB578130a645d5c69E9c4d183F3A5',
    decimals: 6,
    symbol: 'USDC',
    asset: usdcLogo,
  },
  {
    address: '0x7bc1b67fde923fd3667Fde59684c6c354C8EbFdA',
    decimals: 6,
    symbol: 'USDT',
    asset: usdtLogo,
  },
  {
    address: '0xC0e51E865bc9Fed0a32Cc0B2A65449567Bc5c741',
    decimals: 18,
    symbol: 'XVS',
    asset: xvsLogo,
  },
  {
    address: '0x873A6C4B1e3D883920541a0C61Dc4dcb772140b3',
    decimals: 18,
    symbol: 'UNI',
    asset: uniLogo,
  },
];
