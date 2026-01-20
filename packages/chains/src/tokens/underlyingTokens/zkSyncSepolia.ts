import { iconSrcs } from '../../generated/manifests/tokenIcons';
import { ChainId, type Token } from '../../types';
import { eth } from '../nativeTokens';

export const zkSyncSepolia: Token[] = [
  eth[ChainId.ZKSYNC_SEPOLIA],
  {
    chainId: ChainId.ZKSYNC_SEPOLIA,
    address: '0x3AeCac43A2ebe5D8184e650403bf9F656F9D1cfA',
    decimals: 18,
    symbol: 'XVS',
    iconSrc: iconSrcs.xvs,
  },
  {
    chainId: ChainId.ZKSYNC_SEPOLIA,
    address: '0x53F7e72C7ac55b44c7cd73cC13D4EF4b121678e6',
    decimals: 18,
    symbol: 'WETH',
    iconSrc: iconSrcs.weth,
    tokenWrapped: eth[ChainId.ZKSYNC_SEPOLIA],
  },
  {
    chainId: ChainId.ZKSYNC_SEPOLIA,
    address: '0xeF891B3FA37FfD83Ce8cC7b682E4CADBD8fFc6F0',
    decimals: 8,
    symbol: 'WBTC',
    iconSrc: iconSrcs.wbtc,
  },
  {
    chainId: ChainId.ZKSYNC_SEPOLIA,
    address: '0x9Bf62C9C6AaB7AB8e01271f0d7A401306579709B',
    decimals: 6,
    symbol: 'USDT',
    iconSrc: iconSrcs.usdt,
  },
  {
    chainId: ChainId.ZKSYNC_SEPOLIA,
    address: '0xF98780C8a0843829f98e624d83C3FfDDf43BE984',
    decimals: 6,
    symbol: 'USDC.e',
    iconSrc: iconSrcs.usdc,
  },
  {
    chainId: ChainId.ZKSYNC_SEPOLIA,
    address: '0x512F8b4a3c466a30e8c9BAC9c64638dd710968c2',
    decimals: 6,
    symbol: 'USDC',
    iconSrc: iconSrcs.usdcNative,
  },
  {
    chainId: ChainId.ZKSYNC_SEPOLIA,
    address: '0x8A2E9048F5d658E88D6eD89DdD1F3B5cA0250B9F',
    decimals: 18,
    symbol: 'ZK',
    iconSrc: iconSrcs.zk,
  },
  {
    chainId: ChainId.ZKSYNC_SEPOLIA,
    address: '0x0b3C8fB109f144f6296bF4Ac52F191181bEa003a',
    decimals: 18,
    symbol: 'wUSDM',
    iconSrc: iconSrcs.wUsdm,
  },
  {
    chainId: ChainId.ZKSYNC_SEPOLIA,
    address: '0x8507bb4F4f0915D05432011E384850B65a7FCcD1',
    decimals: 18,
    symbol: 'wstETH',
    iconSrc: iconSrcs.wstEth,
  },
  {
    chainId: ChainId.ZKSYNC_SEPOLIA,
    address: '0x13231E8B60BE0900fB3a3E9dc52C2b39FA4794df',
    decimals: 18,
    symbol: 'zkETH',
    iconSrc: iconSrcs.zkEth,
  },
];
