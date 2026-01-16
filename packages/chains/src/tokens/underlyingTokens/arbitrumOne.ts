import { iconSrcs } from '../../generated/manifests/tokenIcons';
import { ChainId, type Token } from '../../types';
import { eth } from '../nativeTokens';

export const arbitrumOne: Token[] = [
  eth[ChainId.ARBITRUM_ONE],
  {
    chainId: ChainId.ARBITRUM_ONE,
    address: '0x912ce59144191c1204e64559fe8253a0e49e6548',
    decimals: 18,
    symbol: 'ARB',
    iconSrc: iconSrcs.arb,
  },
  {
    chainId: ChainId.ARBITRUM_ONE,
    address: '0x2f2a2543b76a4166549f7aab2e75bef0aefc5b0f',
    decimals: 8,
    symbol: 'WBTC',
    iconSrc: iconSrcs.wbtc,
  },
  {
    chainId: ChainId.ARBITRUM_ONE,
    address: '0x82af49447d8a07e3bd95bd0d56f35241523fbab1',
    decimals: 18,
    symbol: 'WETH',
    iconSrc: iconSrcs.weth,
    tokenWrapped: eth[ChainId.ARBITRUM_ONE],
  },
  {
    chainId: ChainId.ARBITRUM_ONE,
    address: '0xaf88d065e77c8cc2239327c5edb3a432268e5831',
    decimals: 6,
    symbol: 'USDC',
    iconSrc: iconSrcs.usdc,
  },
  {
    chainId: ChainId.ARBITRUM_ONE,
    address: '0xfd086bc7cd5c481dcc9c85ebe478a1c0b69fcbb9',
    decimals: 6,
    symbol: 'USD₮0',
    iconSrc: iconSrcs.usdt0,
  },
  {
    chainId: ChainId.ARBITRUM_ONE,
    address: '0xc1Eb7689147C81aC840d4FF0D298489fc7986d52',
    decimals: 18,
    symbol: 'XVS',
    iconSrc: iconSrcs.xvs,
  },
  {
    chainId: ChainId.ARBITRUM_ONE,
    address: '0x35751007a407ca6FEFfE80b3cB397736D2cf4dbe',
    decimals: 18,
    symbol: 'weETH',
    iconSrc: iconSrcs.weEth,
  },
  {
    chainId: ChainId.ARBITRUM_ONE,
    address: '0x5979D7b546E38E414F7E9822514be443A4800529',
    decimals: 18,
    symbol: 'wstETH',
    iconSrc: iconSrcs.wstEth,
  },
  {
    chainId: ChainId.ARBITRUM_ONE,
    address: '0x47c031236e19d024b42f8AE6780E44A573170703',
    decimals: 18,
    symbol: 'gmBTC/USDC',
    iconSrc: iconSrcs.gmBtcUsdc,
  },
  {
    chainId: ChainId.ARBITRUM_ONE,
    address: '0x70d95587d40A2caf56bd97485aB3Eec10Bee6336',
    decimals: 18,
    symbol: 'gmWETH/USDC',
    iconSrc: iconSrcs.gmWEthUsdc,
  },
];
