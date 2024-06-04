import arbLogo from 'libs/tokens/img/arb.svg';
import ethLogo from 'libs/tokens/img/eth.svg';
import usdcLogo from 'libs/tokens/img/usdc.svg';
import usdtLogo from 'libs/tokens/img/usdt.svg';
import wbtcLogo from 'libs/tokens/img/wbtc.svg';
import wethLogo from 'libs/tokens/img/weth.svg';
import xvsLogo from 'libs/tokens/img/xvs.svg';
import type { Token } from 'types';

const ethToken: Token = {
  address: '0x0000000000000000000000000000000000000000',
  decimals: 18,
  symbol: 'ETH',
  asset: ethLogo,
  isNative: true,
};

export const tokens: Token[] = [
  ethToken,
  {
    address: '0x4371bb358aB5cC192E481543417D2F67b8781731',
    decimals: 18,
    symbol: 'ARB',
    asset: arbLogo,
  },
  {
    address: '0xFb8d93FD3Cf18386a5564bb5619cD1FdB130dF7D',
    decimals: 8,
    symbol: 'WBTC',
    asset: wbtcLogo,
  },
  {
    address: '0x980B62Da83eFf3D4576C647993b0c1D7faf17c73',
    decimals: 18,
    symbol: 'WETH',
    asset: wethLogo,
    tokenWrapped: ethToken,
  },
  {
    address: '0x86f096B1D970990091319835faF3Ee011708eAe8',
    decimals: 6,
    symbol: 'USDC',
    asset: usdcLogo,
  },
  {
    address: '0xf3118a17863996B9F2A073c9A66Faaa664355cf8',
    decimals: 6,
    symbol: 'USDT',
    asset: usdtLogo,
  },
  {
    address: '0x877Dc896e7b13096D3827872e396927BbE704407',
    decimals: 18,
    symbol: 'XVS',
    asset: xvsLogo,
  },
];
