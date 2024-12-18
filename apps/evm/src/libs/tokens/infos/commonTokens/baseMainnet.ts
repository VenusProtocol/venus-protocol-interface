import { NATIVE_TOKEN_ADDRESS } from 'constants/address';
import cbbtcLogo from 'libs/tokens/img/cbbtc.svg';
import ethLogo from 'libs/tokens/img/eth.svg';
import usdcLogo from 'libs/tokens/img/usdc.svg';
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
    address: '0xcbB7C0000aB88B473b1f5aFd9ef808440eed33Bf',
    decimals: 8,
    symbol: 'cbBTC',
    asset: cbbtcLogo,
  },
  {
    address: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913',
    decimals: 6,
    symbol: 'USDC',
    asset: usdcLogo,
  },
  {
    address: '0xebB7873213c8d1d9913D8eA39Aa12d74cB107995',
    decimals: 18,
    symbol: 'XVS',
    asset: xvsLogo,
  },
];
