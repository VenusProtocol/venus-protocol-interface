import aaveLogo from 'packages/tokens/img/aave.svg';
import adaLogo from 'packages/tokens/img/ada.svg';
import alpacaLogo from 'packages/tokens/img/alpaca.svg';
import ankrLogo from 'packages/tokens/img/ankr.svg';
import ankrBNBLogo from 'packages/tokens/img/ankrBNB.svg';
import bifiLogo from 'packages/tokens/img/bifi.png';
import bnbLogo from 'packages/tokens/img/bnb.svg';
import bnbxLogo from 'packages/tokens/img/bnbx.png';
import bswLogo from 'packages/tokens/img/bsw.svg';
import btcbLogo from 'packages/tokens/img/btcb.svg';
import bttLogo from 'packages/tokens/img/btt.svg';
import busdLogo from 'packages/tokens/img/busd.svg';
import cakeLogo from 'packages/tokens/img/cake.svg';
import dogeLogo from 'packages/tokens/img/doge.svg';
import ethLogo from 'packages/tokens/img/eth.svg';
import flokiLogo from 'packages/tokens/img/floki.svg';
import hayLogo from 'packages/tokens/img/hay.png';
import ltcLogo from 'packages/tokens/img/ltc.svg';
import lunaLogo from 'packages/tokens/img/luna.svg';
import maticLogo from 'packages/tokens/img/matic.svg';
import nftLogo from 'packages/tokens/img/nft.png';
import racaLogo from 'packages/tokens/img/raca.png';
import sdLogo from 'packages/tokens/img/sd.svg';
import stkBNBLogo from 'packages/tokens/img/stkBNB.svg';
import sxpLogo from 'packages/tokens/img/sxp.svg';
import theLogo from 'packages/tokens/img/the.svg';
import trxLogo from 'packages/tokens/img/trx.svg';
import tusdLogo from 'packages/tokens/img/tusd.svg';
import twtLogo from 'packages/tokens/img/twt.svg';
import usdcLogo from 'packages/tokens/img/usdc.svg';
import usddLogo from 'packages/tokens/img/usdd.svg';
import usdtLogo from 'packages/tokens/img/usdt.svg';
import ustLogo from 'packages/tokens/img/ust.svg';
import vaiLogo from 'packages/tokens/img/vai.svg';
import vrtLogo from 'packages/tokens/img/vrt.svg';
import wbethLogo from 'packages/tokens/img/wbeth.svg';
import wbnbLogo from 'packages/tokens/img/wbnb.svg';
import winLogo from 'packages/tokens/img/win.svg';
import wooLogo from 'packages/tokens/img/woo.svg';
import xrpLogo from 'packages/tokens/img/xrp.svg';
import xvsLogo from 'packages/tokens/img/xvs.svg';
import { Token, VenusTokenSymbol } from 'types';

export const tokens: Token[] = [
  {
    address: '0x0000000000000000000000000000000000000000',
    decimals: 18,
    symbol: 'BNB',
    asset: bnbLogo,
    isNative: true,
  },
  {
    address: '0xB9e0E753630434d7863528cc73CB7AC638a7c8ff',
    decimals: 18,
    symbol: VenusTokenSymbol.XVS,
    asset: xvsLogo,
  },
  {
    address: '0x5fFbE5302BadED40941A403228E6AD03f93752d9',
    decimals: 18,
    symbol: VenusTokenSymbol.VAI,
    asset: vaiLogo,
  },
  {
    address: '0x331F639B4F3CF6E391CD244e0b5027C5968Ec325',
    decimals: 18,
    symbol: VenusTokenSymbol.VRT,
    asset: vrtLogo,
  },
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
    address: '0x5A79efD958432E72211ee73D5DDFa9bc8f248b5F',
    decimals: 18,
    symbol: 'UST',
    asset: ustLogo,
  },
  {
    address: '0xf36160EC62E3B191EA375dadfe465E8Fa1F8CabB',
    decimals: 6,
    symbol: 'LUNA',
    asset: lunaLogo,
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
    address: '0x167F1F9EF531b3576201aa3146b13c57dbEda514',
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
    symbol: 'HAY',
    asset: hayLogo,
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
    address: '0xf9F98365566F4D55234f24b99caA1AfBE6428D44',
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
    address: '0xB1cbD28Cb101c87b5F94a14A8EF081EA7F985593',
    decimals: 18,
    symbol: 'THE',
    asset: theLogo,
  },
];
