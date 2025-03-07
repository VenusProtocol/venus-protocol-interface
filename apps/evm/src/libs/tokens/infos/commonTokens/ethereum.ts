import { NATIVE_TOKEN_ADDRESS } from 'constants/address';

import balLogo from 'libs/tokens/img/underlyingTokens/bal.svg';
import carrotLogo from 'libs/tokens/img/underlyingTokens/carrot.png';
import crvLogo from 'libs/tokens/img/underlyingTokens/crv.png';
import crvUsdLogo from 'libs/tokens/img/underlyingTokens/crvUsd.png';
import daiLogo from 'libs/tokens/img/underlyingTokens/dai.svg';
import eBtcLogo from 'libs/tokens/img/underlyingTokens/eBtc.png';
import eigenLogo from 'libs/tokens/img/underlyingTokens/eigen.svg';
import ethLogo from 'libs/tokens/img/underlyingTokens/eth.svg';
import ezEthLogo from 'libs/tokens/img/underlyingTokens/ezEth.png';
import fraxLogo from 'libs/tokens/img/underlyingTokens/frax.svg';
import lBtcLogo from 'libs/tokens/img/underlyingTokens/lbtc.svg';
import ptSUsdELogo from 'libs/tokens/img/underlyingTokens/ptSUsdE.svg';
import ptUsdELogo from 'libs/tokens/img/underlyingTokens/ptUsdE.svg';
import ptWeethLogo from 'libs/tokens/img/underlyingTokens/ptWeeth.png';
import pufEthLogo from 'libs/tokens/img/underlyingTokens/pufEth.png';
import rsEthLogo from 'libs/tokens/img/underlyingTokens/rsEth.svg';
import sFraxLogo from 'libs/tokens/img/underlyingTokens/sFrax.svg';
import sUsdELogo from 'libs/tokens/img/underlyingTokens/sUsdE.svg';
import sUsdsLogo from 'libs/tokens/img/underlyingTokens/sUsds.svg';
import sfrxEthLogo from 'libs/tokens/img/underlyingTokens/sfrxEth.svg';
import tusdLogo from 'libs/tokens/img/underlyingTokens/tusd.svg';
import usdcLogo from 'libs/tokens/img/underlyingTokens/usdc.svg';
import usdsLogo from 'libs/tokens/img/underlyingTokens/usds.svg';
import usdtLogo from 'libs/tokens/img/underlyingTokens/usdt.svg';
import wBtcLogo from 'libs/tokens/img/underlyingTokens/wbtc.svg';
import weEthLogo from 'libs/tokens/img/underlyingTokens/weEth.svg';
import weEthsLogo from 'libs/tokens/img/underlyingTokens/weeths.svg';
import wethLogo from 'libs/tokens/img/underlyingTokens/weth.svg';
import wstEthLogo from 'libs/tokens/img/underlyingTokens/wstEth.svg';
import xvsLogo from 'libs/tokens/img/underlyingTokens/xvs.svg';
import yvUsdcLogo from 'libs/tokens/img/underlyingTokens/yvusdc.svg';
import yvUsdsLogo from 'libs/tokens/img/underlyingTokens/yvusds.svg';
import yvUsdtLogo from 'libs/tokens/img/underlyingTokens/yvusdt.svg';
import yvWEthLogo from 'libs/tokens/img/underlyingTokens/yvweth.svg';
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
  {
    address: '0x0000000000085d4780B73119b644AE5ecd22b376',
    decimals: 18,
    symbol: 'TUSD',
    asset: tusdLogo,
  },
  {
    address: '0x6b175474e89094c44da98b954eedeac495271d0f',
    decimals: 18,
    symbol: 'DAI',
    asset: daiLogo,
  },
  {
    address: '0x853d955acef822db058eb8505911ed77f175b99e',
    decimals: 18,
    symbol: 'FRAX',
    asset: fraxLogo,
  },
  {
    address: '0xa663b02cf0a4b149d2ad41910cb81e23e1c41c32',
    decimals: 18,
    symbol: 'sFRAX',
    asset: sFraxLogo,
  },
  {
    address: '0x6ee2b5e19ecba773a352e5b21415dc419a700d1d',
    decimals: 18,
    symbol: 'PT-weETH-DEC24',
    asset: ptWeethLogo,
  },
  {
    address: '0xA1290d69c65A6Fe4DF752f95823fae25cB99e5A7',
    decimals: 18,
    symbol: 'rsETH',
    asset: rsEthLogo,
  },
  {
    address: '0xac3E018457B222d93114458476f3E3416Abbe38F',
    decimals: 18,
    symbol: 'sfrxETH',
    asset: sfrxEthLogo,
  },
  {
    address: '0xbf5495Efe5DB9ce00f80364C8B423567e58d2110',
    decimals: 18,
    symbol: 'ezETH',
    asset: ezEthLogo,
  },
  {
    address: '0x917ceE801a67f933F2e6b33fC0cD1ED2d5909D88',
    decimals: 18,
    symbol: 'weETHs',
    asset: weEthsLogo,
  },
  {
    address: '0xD9A442856C234a39a81a089C06451EBAa4306a72',
    decimals: 18,
    symbol: 'pufETH',
    asset: pufEthLogo,
  },
  {
    address: '0xec53bf9167f50cdeb3ae105f56099aaab9061f83',
    decimals: 18,
    symbol: 'EIGEN',
    asset: eigenLogo,
  },
  {
    address: '0x657e8c867d8b37dcc18fa4caead9c45eb088c642',
    decimals: 8,
    symbol: 'eBTC',
    asset: eBtcLogo,
  },
  {
    address: '0x8236a87084f8B84306f72007F36F2618A5634494',
    decimals: 8,
    symbol: 'LBTC',
    asset: lBtcLogo,
  },
  {
    address: '0x9D39A5DE30e57443BfF2A8307A4256c8797A3497',
    decimals: 18,
    symbol: 'sUSDe',
    asset: sUsdELogo,
  },
  {
    address: '0x8A47b431A7D947c6a3ED6E42d501803615a97EAa',
    decimals: 18,
    symbol: 'PT-USDe-MAR25',
    asset: ptUsdELogo,
  },
  {
    address: '0xE00bd3Df25fb187d6ABBB620b3dfd19839947b81',
    decimals: 18,
    symbol: 'PT-sUSDE-MAR25',
    asset: ptSUsdELogo,
  },
  {
    address: '0xa3931d71877c0e7a3148cb7eb4463524fec27fbd',
    decimals: 18,
    symbol: 'sUSDS',
    asset: sUsdsLogo,
  },
  {
    address: '0xdC035D45d973E3EC169d2276DDab16f1e407384F',
    decimals: 18,
    symbol: 'USDS',
    asset: usdsLogo,
  },
  {
    address: '0xba100000625a3754423978a60c9317c58a424e3D',
    decimals: 18,
    symbol: 'BAL',
    asset: balLogo,
  },
  {
    address: '0xBe53A109B494E5c9f97b9Cd39Fe969BE68BF6204',
    decimals: 6,
    symbol: 'yvUSDC-1',
    asset: yvUsdcLogo,
  },
  {
    address: '0x310B7Ea7475A0B449Cfd73bE81522F1B88eFAFaa',
    decimals: 6,
    symbol: 'yvUSDT-1',
    asset: yvUsdtLogo,
  },
  {
    address: '0x182863131F9a4630fF9E27830d945B1413e347E8',
    decimals: 18,
    symbol: 'yvUSDS-1',
    asset: yvUsdsLogo,
  },
  {
    address: '0xc56413869c6CDf96496f2b1eF801fEDBdFA7dDB0',
    decimals: 18,
    symbol: 'yvWETH-1',
    asset: yvWEthLogo,
  },
  {
    address: '0x8A5A5DE9db5770123Ff2145F59e9F20047f0A8EC',
    decimals: 18,
    symbol: 'mtwCARROT',
    asset: carrotLogo,
  },
];
