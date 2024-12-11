import { NATIVE_TOKEN_ADDRESS } from 'constants/address';
import cbbtcLogo from 'libs/tokens/img/cbbtc.svg';
import ethLogo from 'libs/tokens/img/eth.svg';
import usdcNativeLogo from 'libs/tokens/img/usdcNative.svg';
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
    asset: usdcNativeLogo,
  },
  {
    address: '0xE657EDb5579B82135a274E85187927C42E38C021',
    decimals: 18,
    symbol: 'XVS',
    asset: xvsLogo,
  },
];
