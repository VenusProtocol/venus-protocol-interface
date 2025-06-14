import cbbtcLogo from 'libs/tokens/img/underlyingTokens/cbbtc.svg';
import uniLogo from 'libs/tokens/img/underlyingTokens/uni.svg';
import usdcLogo from 'libs/tokens/img/underlyingTokens/usdc.svg';
import usdtLogo from 'libs/tokens/img/underlyingTokens/usdt.svg';
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
  {
    address: '0x3B3aCc90D848981E69052FD461123EA19dca6cAF',
    decimals: 18,
    symbol: 'weETH',
    asset: weEthLogo,
  },
  {
    address: '0x114B3fD3dA17F8EDBc19a3AEE43aC168Ca5b03b4',
    decimals: 18,
    symbol: 'wstETH',
    asset: wstEthLogo,
  },
  {
    address: '0x6f64364A62F9c0eb102b54E0dDa7666E1d3266aB',
    decimals: 6,
    symbol: 'USD₮0',
    asset: usdt0Logo,
  },
  {
    address: '0x0f850f13fd273348046f1BaDc5aCb80271A672C4',
    decimals: 8,
    symbol: 'WBTC',
    asset: wbtcLogo,
  },
];
