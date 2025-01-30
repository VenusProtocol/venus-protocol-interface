import { NATIVE_TOKEN_ADDRESS } from 'constants/address';
import cbbtcLogo from 'libs/tokens/img/underlyingTokens/cbbtc.svg';
import ethLogo from 'libs/tokens/img/underlyingTokens/eth.svg';
import usdcLogo from 'libs/tokens/img/underlyingTokens/usdc.svg';
import wSuperOEthBLogo from 'libs/tokens/img/underlyingTokens/wSuperOEthB.svg';
import wethLogo from 'libs/tokens/img/underlyingTokens/weth.svg';
import xvsLogo from 'libs/tokens/img/underlyingTokens/xvs.svg';
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
    address: '0x4200000000000000000000000000000000000006',
    decimals: 18,
    symbol: 'WETH',
    asset: wethLogo,
    tokenWrapped: ethToken,
  },
  {
    address: '0x0948001047A07e38F685f9a11ea1ddB16B234af9',
    decimals: 8,
    symbol: 'cbBTC',
    asset: cbbtcLogo,
  },
  {
    address: '0xFa264c13d657180e65245a9C3ac8d08b9F5Fc54D',
    decimals: 6,
    symbol: 'USDC',
    asset: usdcLogo,
  },
  {
    address: '0xE657EDb5579B82135a274E85187927C42E38C021',
    decimals: 18,
    symbol: 'XVS',
    asset: xvsLogo,
  },
  {
    address: '0x02B1136d9E223333E0083aeAB76bC441f230a033',
    decimals: 18,
    symbol: 'wsuperOETHb',
    asset: wSuperOEthBLogo,
  },
];
