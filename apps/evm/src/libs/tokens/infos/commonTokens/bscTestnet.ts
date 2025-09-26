import aaveLogo from 'libs/tokens/img/underlyingTokens/aave.svg';
import adaLogo from 'libs/tokens/img/underlyingTokens/ada.svg';
import alpacaLogo from 'libs/tokens/img/underlyingTokens/alpaca.png';
import angleLogo from 'libs/tokens/img/underlyingTokens/angle.svg';
import ankrLogo from 'libs/tokens/img/underlyingTokens/ankr.svg';
import ankrBNBLogo from 'libs/tokens/img/underlyingTokens/ankrBNB.svg';
import asBnbLogo from 'libs/tokens/img/underlyingTokens/asBnb.svg';
import babyDogeLogo from 'libs/tokens/img/underlyingTokens/babyDoge.svg';
import bifiLogo from 'libs/tokens/img/underlyingTokens/bifi.png';
import bnbxLogo from 'libs/tokens/img/underlyingTokens/bnbx.png';
import bswLogo from 'libs/tokens/img/underlyingTokens/bsw.svg';
import btcbLogo from 'libs/tokens/img/underlyingTokens/btcb.svg';
import bttLogo from 'libs/tokens/img/underlyingTokens/btt.svg';
import busdLogo from 'libs/tokens/img/underlyingTokens/busd.svg';
import cakeLogo from 'libs/tokens/img/underlyingTokens/cake.svg';
import dogeLogo from 'libs/tokens/img/underlyingTokens/doge.svg';
import ethLogo from 'libs/tokens/img/underlyingTokens/eth.svg';
import euraLogo from 'libs/tokens/img/underlyingTokens/eura.svg';
import fdusdLogo from 'libs/tokens/img/underlyingTokens/fdusd.svg';
import flokiLogo from 'libs/tokens/img/underlyingTokens/floki.svg';
import lisUsdLogo from 'libs/tokens/img/underlyingTokens/lisUSD.png';
import ltcLogo from 'libs/tokens/img/underlyingTokens/ltc.svg';
import maticLogo from 'libs/tokens/img/underlyingTokens/matic.svg';
import nftLogo from 'libs/tokens/img/underlyingTokens/nft.png';
import planetLogo from 'libs/tokens/img/underlyingTokens/planet.svg';
import ptClisBNBLogo from 'libs/tokens/img/underlyingTokens/ptClisBNB.svg';
import ptSUsdELogo from 'libs/tokens/img/underlyingTokens/ptSUsdE.svg';
import ptSolvBtcLogo from 'libs/tokens/img/underlyingTokens/ptSolvBtc.svg';
import ptUsdELogo from 'libs/tokens/img/underlyingTokens/ptUsdE.svg';
import racaLogo from 'libs/tokens/img/underlyingTokens/raca.png';
import sUsdELogo from 'libs/tokens/img/underlyingTokens/sUsdE.svg';
import sdLogo from 'libs/tokens/img/underlyingTokens/sd.svg';
import slisBnbLogo from 'libs/tokens/img/underlyingTokens/slisBNB.png';
import solLogo from 'libs/tokens/img/underlyingTokens/sol.svg';
import solvBtcLogo from 'libs/tokens/img/underlyingTokens/solvBtc.png';
import stkBNBLogo from 'libs/tokens/img/underlyingTokens/stkBNB.svg';
import sxpLogo from 'libs/tokens/img/underlyingTokens/sxp.svg';
import theLogo from 'libs/tokens/img/underlyingTokens/the.svg';
import trxLogo from 'libs/tokens/img/underlyingTokens/trx.svg';
import tusdLogo from 'libs/tokens/img/underlyingTokens/tusd.svg';
import twtLogo from 'libs/tokens/img/underlyingTokens/twt.svg';
import uniLogo from 'libs/tokens/img/underlyingTokens/uni.svg';
import usd1Logo from 'libs/tokens/img/underlyingTokens/usd1.png';
import usdcLogo from 'libs/tokens/img/underlyingTokens/usdc.svg';
import usddLogo from 'libs/tokens/img/underlyingTokens/usdd.svg';
import usdeLogo from 'libs/tokens/img/underlyingTokens/usde.svg';
import usdfLogo from 'libs/tokens/img/underlyingTokens/usdf.png';
import usdtLogo from 'libs/tokens/img/underlyingTokens/usdt.svg';
import vaiLogo from 'libs/tokens/img/underlyingTokens/vai.svg';
import vrtLogo from 'libs/tokens/img/underlyingTokens/vrt.svg';
import wbethLogo from 'libs/tokens/img/underlyingTokens/wbeth.svg';
import wbnbLogo from 'libs/tokens/img/underlyingTokens/wbnb.svg';
import weEthLogo from 'libs/tokens/img/underlyingTokens/weEth.svg';
import winLogo from 'libs/tokens/img/underlyingTokens/win.svg';
import wooLogo from 'libs/tokens/img/underlyingTokens/woo.svg';
import wstEthLogo from 'libs/tokens/img/underlyingTokens/wstEth.svg';
import xSolvBtcLogo from 'libs/tokens/img/underlyingTokens/xSolvBtc.svg';
import xrpLogo from 'libs/tokens/img/underlyingTokens/xrp.svg';
import xvsLogo from 'libs/tokens/img/underlyingTokens/xvs.svg';
import type { Token } from 'types';
import { bnb } from '../nativeTokens';

export const tokens: Token[] = [
  {
    address: '0xB9e0E753630434d7863528cc73CB7AC638a7c8ff',
    decimals: 18,
    symbol: 'XVS',
    asset: xvsLogo,
  },
  {
    address: '0x5fFbE5302BadED40941A403228E6AD03f93752d9',
    decimals: 18,
    symbol: 'VAI',
    asset: vaiLogo,
  },
  {
    address: '0x331F639B4F3CF6E391CD244e0b5027C5968Ec325',
    decimals: 18,
    symbol: 'VRT',
    asset: vrtLogo,
  },
  bnb,
  {
    address: '0x75107940Cf1121232C0559c747A986DEfbc69DA9',
    decimals: 18,
    symbol: 'SXP',
    asset: sxpLogo,
  },
  {
    address: '0x16227D60f7a0e586C66B005219dfc887D13C9531',
    decimals: 6,
    symbol: 'USDC',
    asset: usdcLogo,
  },
  {
    address: '0xA11c8D9DC9b66E209Ef60F0C8D969D3CD988782c',
    decimals: 6,
    symbol: 'USDT',
    asset: usdtLogo,
  },
  {
    address: '0x8301F2213c0eeD49a7E28Ae4c3e91722919B8B47',
    decimals: 18,
    symbol: 'BUSD',
    asset: busdLogo,
  },

  {
    address: '0xA808e341e8e723DC6BA0Bb5204Bafc2330d7B8e4',
    decimals: 18,
    symbol: 'BTCB',
    asset: btcbLogo,
  },
  {
    address: '0x98f7A83361F7Ac8765CcEBAB1425da6b341958a7',
    decimals: 18,
    symbol: 'ETH',
    asset: ethLogo,
  },
  {
    address: '0x969F147B6b8D81f86175de33206A4FD43dF17913',
    decimals: 18,
    symbol: 'LTC',
    asset: ltcLogo,
  },
  {
    address: '0x3022A32fdAdB4f02281E8Fab33e0A6811237aab0',
    decimals: 18,
    symbol: 'XRP',
    asset: xrpLogo,
  },
  {
    address: '0xcD34BC54106bd45A04Ed99EBcC2A6a3e70d7210F',
    decimals: 18,
    symbol: 'ADA',
    asset: adaLogo,
  },
  {
    address: '0x67D262CE2b8b846d9B94060BC04DC40a83F0e25B',
    decimals: 8,
    symbol: 'DOGE',
    asset: dogeLogo,
  },
  {
    address: '0xcfeb0103d4BEfa041EA4c2dACce7B3E83E1aE7E3',
    decimals: 18,
    symbol: 'MATIC',
    asset: maticLogo,
  },
  {
    address: '0xe8bd7cCC165FAEb9b81569B05424771B9A20cbEF',
    decimals: 18,
    symbol: 'CAKE',
    asset: cakeLogo,
  },
  {
    address: '0x4B7268FC7C727B88c5Fc127D41b491BfAe63e144',
    decimals: 18,
    symbol: 'AAVE',
    asset: aaveLogo,
  },
  {
    address: '0xB32171ecD878607FFc4F8FC0bCcE6852BB3149E0',
    decimals: 18,
    symbol: 'TUSD',
    asset: tusdLogo,
  },
  {
    address: '0xFeC3A63401Eb9C1476200d7C32c4009Be0154169',
    decimals: 18,
    symbol: 'TUSDOLD',
    asset: tusdLogo,
  },
  {
    address: '0x7D21841DC10BA1C5797951EFc62fADBBDD06704B',
    decimals: 6,
    symbol: 'TRX',
    asset: trxLogo,
  },
  {
    address: '0x19E7215abF8B2716EE807c9f4b83Af0e7f92653F',
    decimals: 18,
    symbol: 'TRXOLD',
    asset: trxLogo,
  },
  {
    address: '0x6923189d91fdF62dBAe623a55273F1d20306D9f2',
    decimals: 18,
    symbol: 'ALPACA',
    asset: alpacaLogo,
  },
  {
    address: '0xe4a90EB942CF2DA7238e8F6cC9EF510c49FC8B4B',
    decimals: 18,
    symbol: 'ANKR',
    asset: ankrLogo,
  },
  {
    address: '0x5269b7558D3d5E113010Ef1cFF0901c367849CC9',
    decimals: 18,
    symbol: 'ankrBNB',
    asset: ankrBNBLogo,
  },
  {
    address: '0x5B662703775171c4212F2FBAdb7F92e64116c154',
    decimals: 18,
    symbol: 'BIFI',
    asset: bifiLogo,
  },
  {
    address: '0x327d6E6FAC0228070884e913263CFF9eFed4a2C8',
    decimals: 18,
    symbol: 'BNBx',
    asset: bnbxLogo,
  },
  {
    address: '0x7FCC76fc1F573d8Eb445c236Cc282246bC562bCE',
    decimals: 18,
    symbol: 'BSW',
    asset: bswLogo,
  },
  {
    address: '0xE98344A7c691B200EF47c9b8829110087D832C64',
    decimals: 18,
    symbol: 'BTT',
    asset: bttLogo,
  },
  {
    address: '0xb22cF15FBc089d470f8e532aeAd2baB76bE87c88',
    decimals: 18,
    symbol: 'FLOKI',
    asset: flokiLogo,
  },
  {
    address: '0xe73774DfCD551BF75650772dC2cC56a2B6323453',
    decimals: 18,
    symbol: 'lisUSD',
    asset: lisUsdLogo,
  },
  {
    address: '0xc440e4F21AFc2C3bDBA1Af7D0E338ED35d3e25bA',
    decimals: 18,
    symbol: 'NFT',
    asset: nftLogo,
  },
  {
    address: '0xD60cC803d888A3e743F21D0bdE4bF2cAfdEA1F26',
    decimals: 18,
    symbol: 'RACA',
    asset: racaLogo,
  },
  {
    address: '0x2999C176eBf66ecda3a646E70CeB5FF4d5fCFb8C',
    decimals: 18,
    symbol: 'stkBNB',
    asset: stkBNBLogo,
  },
  {
    address: '0x2E2466e22FcbE0732Be385ee2FBb9C59a1098382',
    decimals: 18,
    symbol: 'USDD',
    asset: usddLogo,
  },
  {
    symbol: 'WBNB',
    decimals: 18,
    address: '0xae13d989daC2f0dEbFf460aC112a837C89BAa7cd',
    asset: wbnbLogo,
    tokenWrapped: bnb,
  },
  {
    address: '0x2E6Af3f3F059F43D764060968658c9F3c8f9479D',
    decimals: 18,
    symbol: 'WIN',
    asset: winLogo,
  },
  {
    address: '0x65B849A4Fc306AF413E341D44dF8482F963fBB91',
    decimals: 18,
    symbol: 'WOO',
    asset: wooLogo,
  },
  {
    address: '0x9c37E59Ba22c4320547F00D4f1857AF1abd1Dd6f',
    decimals: 18,
    symbol: 'WBETH',
    asset: wbethLogo,
  },
  {
    address: '0xac7D6B77EBD1DB8C5a9f0896e5eB5d485CB677b3',
    decimals: 18,
    symbol: 'SD',
    asset: sdLogo,
  },
  {
    address: '0xb99C6B26Fdf3678c6e2aff8466E3625a0e7182f8',
    decimals: 18,
    symbol: 'TWT',
    asset: twtLogo,
  },
  {
    address: '0x952653d23cB9bef19E442D2BF8fBc8843A968052',
    decimals: 18,
    symbol: 'THE',
    asset: theLogo,
  },
  {
    address: '0xd2aF6A916Bc77764dc63742BC30f71AF4cF423F4',
    decimals: 18,
    symbol: 'slisBNB',
    asset: slisBnbLogo,
  },
  {
    address: '0x63061de4A25f24279AAab80400040684F92Ee319',
    decimals: 18,
    symbol: 'EURA',
    asset: euraLogo,
  },
  {
    address: '0xD1Bc731d188ACc3f52a6226B328a89056B0Ec71a',
    decimals: 18,
    symbol: 'ANGLE',
    asset: angleLogo,
  },
  {
    address: '0x8D2f061C75780d8D91c10A7230B907411aCBC8fC',
    decimals: 18,
    symbol: 'UNI',
    asset: uniLogo,
  },
  {
    address: '0x52b4E1A2ba407813F829B4b3943A1e57768669A9',
    decimals: 18,
    symbol: 'PLANET',
    asset: planetLogo,
  },
  {
    address: '0xcF27439fA231af9931ee40c4f27Bb77B83826F3C',
    decimals: 18,
    symbol: 'FDUSD',
    asset: fdusdLogo,
  },
  {
    address: '0x4FA37fFA9f36Ec0e0e685C06a7bF169bb50409ce',
    decimals: 9,
    symbol: 'BabyDoge',
    asset: babyDogeLogo,
  },
  {
    address: '0x7df9372096c8ca2401f30B3dF931bEFF493f1FdC',
    decimals: 18,
    symbol: 'weETH',
    asset: weEthLogo,
  },
  {
    address: '0x4349016259FCd8eE452f696b2a7beeE31667D129',
    decimals: 18,
    symbol: 'wstETH',
    asset: wstEthLogo,
  },
  {
    address: '0x6855E14A6df91b8E4D55163d068E9ef2530fd4CE',
    decimals: 18,
    symbol: 'solvBTC',
    asset: solvBtcLogo,
  },
  {
    address: '0x964Ea3dC70Ee5b35Ea881cf8416B7a5F50E13f56',
    decimals: 18,
    symbol: 'PT-SolvBTC.BBN-MAR25',
    asset: ptSolvBtcLogo,
  },
  {
    address: '0xC337Dd0390FdFD0Ee5D2b682E425986EDD7b59da',
    decimals: 18,
    symbol: 'SOL',
    asset: solLogo,
  },
  {
    address: '0x14AECeEc177085fd09EA07348B4E1F7Fcc030fA1',
    decimals: 18,
    symbol: 'PT-clisBNB-APR25',
    asset: ptClisBNBLogo,
  },
  {
    address: '0xc625f060ad25f4A6c2d9eBF30C133dB61B7AF072',
    decimals: 18,
    symbol: 'asBNB',
    asset: asBnbLogo,
  },
  {
    address: '0x95e58161BA2423c3034658d957F3f5b94DeAbf81',
    decimals: 18,
    symbol: 'PT-sUSDE-JUN2025',
    asset: ptSUsdELogo,
  },
  {
    address: '0x986C30591f5aAb401ea3aa63aFA595608721B1B9',
    decimals: 18,
    symbol: 'USDe',
    asset: usdeLogo,
  },
  {
    address: '0xcFec590e417Abb378cfEfE6296829E35fa25cEbd',
    decimals: 18,
    symbol: 'sUSDe',
    asset: sUsdELogo,
  },
  {
    address: '0x7792af341a10ccc4B1CDd7B317F0460a37346a0A',
    decimals: 18,
    symbol: 'USD1',
    asset: usd1Logo,
  },
  {
    address: '0x3ea87323806586A0282b50377e0FEa76070F532B',
    decimals: 18,
    symbol: 'xSolvBTC',
    asset: xSolvBtcLogo,
  },
  {
    address: '0xC7a2b79432Fd3e3d5bd2d96A456c734AB93A0484',
    decimals: 18,
    symbol: 'USDF',
    asset: usdfLogo,
  },
  {
    address: '0x0c98334aCF440b9936D9cc1d99dc1A77bf26a93B',
    decimals: 18,
    symbol: 'PT-USDe-30OCT2025',
    asset: ptUsdELogo,
  },
];
