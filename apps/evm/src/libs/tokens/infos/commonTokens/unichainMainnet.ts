import { NATIVE_TOKEN_ADDRESS } from 'constants/address';
import ethLogo from 'libs/tokens/img/underlyingTokens/eth.svg';
import usdcLogo from 'libs/tokens/img/underlyingTokens/usdc.svg';
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
    address: '0x078D782b760474a361dDA0AF3839290b0EF57AD6',
    decimals: 6,
    symbol: 'USDC',
    asset: usdcLogo,
  },
  {
    address: '0x81908BBaad3f6fC74093540Ab2E9B749BB62aA0d',
    decimals: 18,
    symbol: 'XVS',
    asset: xvsLogo,
  },
];
