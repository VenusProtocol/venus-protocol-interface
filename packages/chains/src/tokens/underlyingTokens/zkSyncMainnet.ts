import { iconSrcs } from '../../generated/manifests/tokenIcons';
import { ChainId, type Token } from '../../types';
import { eth } from '../nativeTokens';

export const zkSyncMainnet: Token[] = [
  eth[ChainId.ZKSYNC_MAINNET],
  {
    chainId: ChainId.ZKSYNC_MAINNET,
    address: '0xD78ABD81a3D57712a3af080dc4185b698Fe9ac5A',
    decimals: 18,
    symbol: 'XVS',
    iconSrc: iconSrcs.xvs,
  },
  {
    chainId: ChainId.ZKSYNC_MAINNET,
    address: '0x5aea5775959fbc2557cc8789bc1bf90a239d9a91',
    decimals: 18,
    symbol: 'WETH',
    iconSrc: iconSrcs.weth,
    tokenWrapped: eth[ChainId.ZKSYNC_MAINNET],
  },
  {
    chainId: ChainId.ZKSYNC_MAINNET,
    address: '0xbbeb516fb02a01611cbbe0453fe3c580d7281011',
    decimals: 8,
    symbol: 'WBTC',
    iconSrc: iconSrcs.wbtc,
  },
  {
    chainId: ChainId.ZKSYNC_MAINNET,
    address: '0x493257fd37edb34451f62edf8d2a0c418852ba4c',
    decimals: 6,
    symbol: 'USDT',
    iconSrc: iconSrcs.usdt,
  },
  {
    chainId: ChainId.ZKSYNC_MAINNET,
    address: '0x3355df6d4c9c3035724fd0e3914de96a5a83aaf4',
    decimals: 6,
    symbol: 'USDC.e',
    iconSrc: iconSrcs.usdc,
  },
  {
    chainId: ChainId.ZKSYNC_MAINNET,
    address: '0x1d17CBcF0D6D143135aE902365D2E5e2A16538D4',
    decimals: 6,
    symbol: 'USDC',
    iconSrc: iconSrcs.usdcNative,
  },
  {
    chainId: ChainId.ZKSYNC_MAINNET,
    address: '0x5a7d6b2f92c77fad6ccabd7ee0624e64907eaf3e',
    decimals: 18,
    symbol: 'ZK',
    iconSrc: iconSrcs.zk,
  },
  {
    chainId: ChainId.ZKSYNC_MAINNET,
    address: '0xA900cbE7739c96D2B153a273953620A701d5442b',
    decimals: 18,
    symbol: 'wUSDM',
    iconSrc: iconSrcs.wUsdm,
  },
  {
    chainId: ChainId.ZKSYNC_MAINNET,
    address: '0x703b52f2b28febcb60e1372858af5b18849fe867',
    decimals: 18,
    symbol: 'wstETH',
    iconSrc: iconSrcs.wstEth,
  },
  {
    chainId: ChainId.ZKSYNC_MAINNET,
    address: '0xb72207E1FB50f341415999732A20B6D25d8127aa',
    decimals: 18,
    symbol: 'zkETH',
    iconSrc: iconSrcs.zkEth,
  },
];
