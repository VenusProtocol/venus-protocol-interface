import { iconSrcs } from '../../generated/manifests/tokenIcons';
import { ChainId, type Token } from '../../types';

import { eth } from '../nativeTokens';

export const unichainMainnet: Token[] = [
  eth[ChainId.UNICHAIN_MAINNET],
  {
    chainId: ChainId.UNICHAIN_MAINNET,
    address: '0x4200000000000000000000000000000000000006',
    decimals: 18,
    symbol: 'WETH',
    iconSrc: iconSrcs.weth,
    tokenWrapped: eth[ChainId.UNICHAIN_MAINNET],
  },
  {
    chainId: ChainId.UNICHAIN_MAINNET,
    address: '0x078D782b760474a361dDA0AF3839290b0EF57AD6',
    decimals: 6,
    symbol: 'USDC',
    iconSrc: iconSrcs.usdc,
  },
  {
    chainId: ChainId.UNICHAIN_MAINNET,
    address: '0x81908BBaad3f6fC74093540Ab2E9B749BB62aA0d',
    decimals: 18,
    symbol: 'XVS',
    iconSrc: iconSrcs.xvs,
  },
  {
    chainId: ChainId.UNICHAIN_MAINNET,
    address: '0x8f187aa05619a017077f5308904739877ce9ea21',
    decimals: 18,
    symbol: 'UNI',
    iconSrc: iconSrcs.uni,
  },
  {
    chainId: ChainId.UNICHAIN_MAINNET,
    address: '0x7DCC39B4d1C53CB31e1aBc0e358b43987FEF80f7',
    decimals: 18,
    symbol: 'weETH',
    iconSrc: iconSrcs.weEth,
  },
  {
    chainId: ChainId.UNICHAIN_MAINNET,
    address: '0xc02fE7317D4eb8753a02c35fe019786854A92001',
    decimals: 18,
    symbol: 'wstETH',
    iconSrc: iconSrcs.wstEth,
  },

  {
    chainId: ChainId.UNICHAIN_MAINNET,
    address: '0x9151434b16b9763660705744891fA906F660EcC5',
    decimals: 6,
    symbol: 'USD₮0',
    iconSrc: iconSrcs.usdt0,
  },
  {
    chainId: ChainId.UNICHAIN_MAINNET,
    address: '0x0555e30da8f98308edb960aa94c0db47230d2b9c',
    decimals: 8,
    symbol: 'WBTC',
    iconSrc: iconSrcs.wbtc,
  },
];
