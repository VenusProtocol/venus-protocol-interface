import { NATIVE_TOKEN_ADDRESS } from 'constants/address';
import ethLogo from 'libs/tokens/img/underlyingTokens/eth.svg';
import usdcLogo from 'libs/tokens/img/underlyingTokens/usdc.svg';
import usdcNativeLogo from 'libs/tokens/img/underlyingTokens/usdcNative.svg';
import usdtLogo from 'libs/tokens/img/underlyingTokens/usdt.svg';
import wUsdmLogo from 'libs/tokens/img/underlyingTokens/wUsdm.png';
import wbtcLogo from 'libs/tokens/img/underlyingTokens/wbtc.svg';
import wethLogo from 'libs/tokens/img/underlyingTokens/weth.svg';
import wstEthLogo from 'libs/tokens/img/underlyingTokens/wstEth.svg';
import xvsLogo from 'libs/tokens/img/underlyingTokens/xvs.svg';
import zkLogo from 'libs/tokens/img/underlyingTokens/zk.svg';
import zkEthLogo from 'libs/tokens/img/underlyingTokens/zkEth.svg';
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
    address: '0xD78ABD81a3D57712a3af080dc4185b698Fe9ac5A',
    decimals: 18,
    symbol: 'XVS',
    asset: xvsLogo,
  },
  {
    address: '0x5aea5775959fbc2557cc8789bc1bf90a239d9a91',
    decimals: 18,
    symbol: 'WETH',
    asset: wethLogo,
    tokenWrapped: ethToken,
  },
  {
    address: '0xbbeb516fb02a01611cbbe0453fe3c580d7281011',
    decimals: 8,
    symbol: 'WBTC',
    asset: wbtcLogo,
  },
  {
    address: '0x493257fd37edb34451f62edf8d2a0c418852ba4c',
    decimals: 6,
    symbol: 'USDT',
    asset: usdtLogo,
  },
  {
    address: '0x3355df6d4c9c3035724fd0e3914de96a5a83aaf4',
    decimals: 6,
    symbol: 'USDC.e',
    asset: usdcLogo,
  },
  {
    address: '0x1d17CBcF0D6D143135aE902365D2E5e2A16538D4',
    decimals: 6,
    symbol: 'USDC',
    asset: usdcNativeLogo,
  },
  {
    address: '0x5a7d6b2f92c77fad6ccabd7ee0624e64907eaf3e',
    decimals: 18,
    symbol: 'ZK',
    asset: zkLogo,
  },
  {
    address: '0xA900cbE7739c96D2B153a273953620A701d5442b',
    decimals: 18,
    symbol: 'wUSDM',
    asset: wUsdmLogo,
  },
  {
    address: '0x703b52f2b28febcb60e1372858af5b18849fe867',
    decimals: 18,
    symbol: 'wstETH',
    asset: wstEthLogo,
  },
  {
    address: '0xb72207E1FB50f341415999732A20B6D25d8127aa',
    decimals: 18,
    symbol: 'zkETH',
    asset: zkEthLogo,
  },
];
