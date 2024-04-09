import crvLogo from 'libs/tokens/img/crv.svg';
import crvUsdLogo from 'libs/tokens/img/crvUsd.svg';
import ethLogo from 'libs/tokens/img/eth.svg';
import usdcLogo from 'libs/tokens/img/usdc.svg';
import usdtLogo from 'libs/tokens/img/usdt.svg';
import wBtcLogo from 'libs/tokens/img/wbtc.svg';
import weEthLogo from 'libs/tokens/img/weEth.svg';
import wethLogo from 'libs/tokens/img/weth.svg';
import wstEthLogo from 'libs/tokens/img/wstEth.svg';
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
    address: '0xd3CC9d8f3689B83c91b7B59cAB4946B063EB894A',
    decimals: 18,
    symbol: 'XVS',
    asset: xvsLogo,
  },
  {
    address: '0x7f39c581f595b53c5cb19bd0b3f8da6c935e2ca0',
    decimals: 18,
    symbol: 'wstETH',
    asset: wstEthLogo,
  },
  {
    address: '0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599',
    decimals: 8,
    symbol: 'WBTC',
    asset: wBtcLogo,
  },
  {
    address: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
    decimals: 18,
    symbol: 'WETH',
    asset: wethLogo,
    tokenWrapped: ethToken,
  },
  {
    address: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
    decimals: 6,
    symbol: 'USDC',
    asset: usdcLogo,
  },
  {
    address: '0xdAC17F958D2ee523a2206206994597C13D831ec7',
    decimals: 6,
    symbol: 'USDT',
    asset: usdtLogo,
  },
  {
    address: '0xf939E0A03FB07F59A73314E73794Be0E57ac1b4E',
    decimals: 18,
    symbol: 'crvUSD',
    asset: crvUsdLogo,
  },
  {
    address: '0xD533a949740bb3306d119CC777fa900bA034cd52',
    decimals: 18,
    symbol: 'CRV',
    asset: crvLogo,
  },
  {
    address: '0xcd5fe23c85820f7b72d0926fc9b05b43e359b7ee',
    decimals: 18,
    symbol: 'weETH',
    asset: weEthLogo,
  },
];
