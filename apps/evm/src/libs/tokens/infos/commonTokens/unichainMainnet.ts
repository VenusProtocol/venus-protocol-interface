import uniLogo from 'libs/tokens/img/underlyingTokens/uni.svg';
import usdcLogo from 'libs/tokens/img/underlyingTokens/usdc.svg';
import usdeLogo from 'libs/tokens/img/underlyingTokens/usde.svg';
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
  {
    address: '0x8f187aa05619a017077f5308904739877ce9ea21',
    decimals: 18,
    symbol: 'UNI',
    asset: uniLogo,
  },
  {
    address: '0x7DCC39B4d1C53CB31e1aBc0e358b43987FEF80f7',
    decimals: 18,
    symbol: 'weETH',
    asset: weEthLogo,
  },
  {
    address: '0xc02fE7317D4eb8753a02c35fe019786854A92001',
    decimals: 18,
    symbol: 'wstETH',
    asset: wstEthLogo,
  },
  {
    address: '0x4c9EDD5852cd905f086C759E8383e09bff1E68B3',
    decimals: 18,
    symbol: 'USDe',
    asset: usdeLogo,
  },
];
