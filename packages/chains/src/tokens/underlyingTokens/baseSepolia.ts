import { iconSrcs } from '../../generated/manifests/tokenIcons';
import { ChainId, type Token } from '../../types';
import { eth } from '../nativeTokens';

export const baseSepolia: Token[] = [
  eth[ChainId.BASE_SEPOLIA],
  {
    chainId: ChainId.BASE_SEPOLIA,
    address: '0x4200000000000000000000000000000000000006',
    decimals: 18,
    symbol: 'WETH',
    iconSrc: iconSrcs.weth,
    tokenWrapped: eth[ChainId.BASE_SEPOLIA],
  },
  {
    chainId: ChainId.BASE_SEPOLIA,
    address: '0x0948001047A07e38F685f9a11ea1ddB16B234af9',
    decimals: 8,
    symbol: 'cbBTC',
    iconSrc: iconSrcs.cbbtc,
  },
  {
    chainId: ChainId.BASE_SEPOLIA,
    address: '0xFa264c13d657180e65245a9C3ac8d08b9F5Fc54D',
    decimals: 6,
    symbol: 'USDC',
    iconSrc: iconSrcs.usdc,
  },
  {
    chainId: ChainId.BASE_SEPOLIA,
    address: '0xE657EDb5579B82135a274E85187927C42E38C021',
    decimals: 18,
    symbol: 'XVS',
    iconSrc: iconSrcs.xvs,
  },
  {
    chainId: ChainId.BASE_SEPOLIA,
    address: '0x02B1136d9E223333E0083aeAB76bC441f230a033',
    decimals: 18,
    symbol: 'wsuperOETHb',
    iconSrc: iconSrcs.wSuperOEthB,
  },
  {
    chainId: ChainId.BASE_SEPOLIA,
    address: '0xAd69AA3811fE0EE7dBd4e25C4bae40e6422c76C8',
    decimals: 18,
    symbol: 'wstETH',
    iconSrc: iconSrcs.wstEth,
  },
];
