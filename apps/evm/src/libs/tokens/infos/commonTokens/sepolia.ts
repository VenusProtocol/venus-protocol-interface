import { NATIVE_TOKEN_ADDRESS } from 'constants/address';

import balLogo from 'libs/tokens/img/underlyingTokens/bal.svg';
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
import wbtcLogo from 'libs/tokens/img/underlyingTokens/wbtc.svg';
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
    address: '0x66ebd019E86e0af5f228a0439EBB33f045CBe63E',
    decimals: 18,
    symbol: 'XVS',
    asset: xvsLogo,
  },
  {
    address: '0x92A2928f5634BEa89A195e7BeCF0f0FEEDAB885b',
    decimals: 8,
    symbol: 'WBTC',
    asset: wbtcLogo,
  },
  {
    address: '0x7b79995e5f793A07Bc00c21412e50Ecae098E7f9',
    decimals: 18,
    symbol: 'WETH',
    asset: wethLogo,
    tokenWrapped: ethToken,
  },
  {
    address: '0x8d412FD0bc5d826615065B931171Eed10F5AF266',
    decimals: 6,
    symbol: 'USDT',
    asset: usdtLogo,
  },
  {
    address: '0x772d68929655ce7234C8C94256526ddA66Ef641E',
    decimals: 6,
    symbol: 'USDC',
    asset: usdcLogo,
  },
  {
    address: '0x2c78EF7eab67A6e0C9cAa6f2821929351bdDF3d3',
    decimals: 18,
    symbol: 'CRV',
    asset: crvLogo,
  },
  {
    address: '0x36421d873abCa3E2bE6BB3c819C0CF26374F63b6',
    decimals: 18,
    symbol: 'crvUSD',
    asset: crvUsdLogo,
  },
  {
    address: '0x9b87ea90fdb55e1a0f17fbeddcf7eb0ac4d50493',
    decimals: 18,
    symbol: 'wstETH',
    asset: wstEthLogo,
  },
  {
    address: '0x3b8b6E96e57f0d1cD366AaCf4CcC68413aF308D0',
    decimals: 18,
    symbol: 'weETH',
    asset: weEthLogo,
  },
  {
    address: '0x78b292069da1661b7C12B6E766cB506C220b987a',
    decimals: 18,
    symbol: 'TUSD',
    asset: tusdLogo,
  },
  {
    address: '0x75236711d42D0f7Ba91E03fdCe0C9377F5b76c07',
    decimals: 18,
    symbol: 'DAI',
    asset: daiLogo,
  },
  {
    address: '0x10630d59848547c9F59538E2d8963D63B912C075',
    decimals: 18,
    symbol: 'FRAX',
    asset: fraxLogo,
  },
  {
    address: '0xd85FfECdB4287587BC53c1934D548bF7480F11C4',
    decimals: 18,
    symbol: 'sFRAX',
    asset: sFraxLogo,
  },
  {
    address: '0x56107201d3e4b7Db92dEa0Edb9e0454346AEb8B5',
    decimals: 18,
    symbol: 'PT-weETH-DEC24',
    asset: ptWeethLogo,
  },
  {
    address: '0xfA0614E5C803E15070d31f7C38d2d430EBe68E47',
    decimals: 18,
    symbol: 'rsETH',
    asset: rsEthLogo,
  },
  {
    address: '0x14AECeEc177085fd09EA07348B4E1F7Fcc030fA1',
    decimals: 18,
    symbol: 'sfrxETH',
    asset: sfrxEthLogo,
  },
  {
    address: '0xB8eb706b85Ae7355c9FE4371a499F50f3484809c',
    decimals: 18,
    symbol: 'ezETH',
    asset: ezEthLogo,
  },
  {
    address: '0xE233527306c2fa1E159e251a2E5893334505A5E0',
    decimals: 18,
    symbol: 'weETHs',
    asset: weEthsLogo,
  },
  {
    address: '0x6D9f78b57AEeB0543a3c3B32Cc038bFB14a4bA68',
    decimals: 18,
    symbol: 'pufETH',
    asset: pufEthLogo,
  },
  {
    address: '0xf140594470Bff436aE82F2116ab8a438671C6e83',
    decimals: 18,
    symbol: 'EIGEN',
    asset: eigenLogo,
  },
  {
    address: '0xd48392CCf3fe028023D0783E570DFc71996859d7',
    decimals: 8,
    symbol: 'eBTC',
    asset: eBtcLogo,
  },
  {
    address: '0x37798CaB3Adde2F4064afBc1C7F9bbBc6A826375',
    decimals: 8,
    symbol: 'LBTC',
    asset: lBtcLogo,
  },
  {
    address: '0xA3A3e5ecEA56940a4Ae32d0927bfd8821DdA848A',
    decimals: 18,
    symbol: 'sUSDe',
    asset: sUsdELogo,
  },
  {
    address: '0x74671106a04496199994787B6BcB064d08afbCCf',
    decimals: 18,
    symbol: 'PT-USDe-MAR25',
    asset: ptUsdELogo,
  },
  {
    address: '0x3EBa2Aa29eC2498c2124523634324d4ce89c8579',
    decimals: 18,
    symbol: 'PT-sUSDE-MAR25',
    asset: ptSUsdELogo,
  },
  {
    address: '0xE9E34fd81982438E96Bd945f5810F910e35F0165',
    decimals: 18,
    symbol: 'sUSDS',
    asset: sUsdsLogo,
  },
  {
    address: '0xfB287f9A45E54df6AADad95C6F37b1471e744762',
    decimals: 18,
    symbol: 'USDS',
    asset: usdsLogo,
  },
  {
    address: '0xa18a6F0F51ddA0BAE3f2368bEE4b1542f6BE66C0',
    decimals: 18,
    symbol: 'BAL',
    asset: balLogo,
  },
  {
    address: '0x9fE6052B9534F134171F567dAC9c9B22556c1DDb',
    decimals: 6,
    symbol: 'yvUSDC-1',
    asset: yvUsdcLogo,
  },
  {
    address: '0x5cBA66C5415E56CC0Ace55148ffC63f61327478B',
    decimals: 6,
    symbol: 'yvUSDT-1',
    asset: yvUsdtLogo,
  },
  {
    address: '0xC6A0e98B8D9E9F1160E9cE1f2E0172F41FB06BC2',
    decimals: 18,
    symbol: 'yvUSDS-1',
    asset: yvUsdsLogo,
  },
  {
    address: '0x99AD7ecf9b1C5aC2A11BB00D7D8a7C54fCd41517',
    decimals: 18,
    symbol: 'yvWETH-1',
    asset: yvWEthLogo,
  },
];
