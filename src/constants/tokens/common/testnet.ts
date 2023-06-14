import { Token } from 'types';

import aave from 'assets/img/tokens/aave.svg';
import ada from 'assets/img/tokens/ada.svg';
import alpaca from 'assets/img/tokens/alpaca.svg';
import ankr from 'assets/img/tokens/ankr.svg';
import ankrBNB from 'assets/img/tokens/ankrBNB.svg';
import bifi from 'assets/img/tokens/bifi.png';
import bnb from 'assets/img/tokens/bnb.svg';
import bnbx from 'assets/img/tokens/bnbx.png';
import bsw from 'assets/img/tokens/bsw.svg';
import btcb from 'assets/img/tokens/btcb.svg';
import btt from 'assets/img/tokens/btt.svg';
import busd from 'assets/img/tokens/busd.svg';
import cake from 'assets/img/tokens/cake.svg';
import doge from 'assets/img/tokens/doge.svg';
import eth from 'assets/img/tokens/eth.svg';
import floki from 'assets/img/tokens/floki.svg';
import hay from 'assets/img/tokens/hay.png';
import ltc from 'assets/img/tokens/ltc.svg';
import luna from 'assets/img/tokens/luna.svg';
import matic from 'assets/img/tokens/matic.svg';
import nft from 'assets/img/tokens/nft.png';
import raca from 'assets/img/tokens/raca.png';
import stkBNB from 'assets/img/tokens/stkBNB.svg';
import sxp from 'assets/img/tokens/sxp.svg';
import trx from 'assets/img/tokens/trx.svg';
import tusd from 'assets/img/tokens/tusd.svg';
import usdc from 'assets/img/tokens/usdc.svg';
import usdd from 'assets/img/tokens/usdd.svg';
import usdt from 'assets/img/tokens/usdt.svg';
import ust from 'assets/img/tokens/ust.svg';
import vai from 'assets/img/tokens/vai.svg';
import vrt from 'assets/img/tokens/vrt.svg';
import wbeth from 'assets/img/tokens/wbeth.svg';
import wbnb from 'assets/img/tokens/wbnb.svg';
import win from 'assets/img/tokens/win.svg';
import woo from 'assets/img/tokens/woo.svg';
import xrp from 'assets/img/tokens/xrp.svg';
import xvs from 'assets/img/tokens/xvs.svg';

export const TESTNET_TOKENS = {
  bnb: {
    address: '0x12eb9ef44de5fbea1b2f5ff7a9a375cae9bfb2eb',
    decimals: 18,
    symbol: 'BNB',
    asset: bnb,
    isNative: true,
  } as Token,
  sxp: {
    address: '0x75107940Cf1121232C0559c747A986DEfbc69DA9',
    decimals: 18,
    symbol: 'SXP',
    asset: sxp,
  } as Token,
  usdc: {
    address: '0x16227D60f7a0e586C66B005219dfc887D13C9531',
    decimals: 6,
    symbol: 'USDC',
    asset: usdc,
  } as Token,
  usdt: {
    address: '0xA11c8D9DC9b66E209Ef60F0C8D969D3CD988782c',
    decimals: 6,
    symbol: 'USDT',
    asset: usdt,
  } as Token,
  busd: {
    address: '0x8301F2213c0eeD49a7E28Ae4c3e91722919B8B47',
    decimals: 18,
    symbol: 'BUSD',
    asset: busd,
  } as Token,
  xvs: {
    address: '0xB9e0E753630434d7863528cc73CB7AC638a7c8ff',
    decimals: 18,
    symbol: 'XVS',
    asset: xvs,
  } as Token,
  btcb: {
    address: '0xA808e341e8e723DC6BA0Bb5204Bafc2330d7B8e4',
    decimals: 18,
    symbol: 'BTCB',
    asset: btcb,
  } as Token,
  eth: {
    address: '0x98f7A83361F7Ac8765CcEBAB1425da6b341958a7',
    decimals: 18,
    symbol: 'ETH',
    asset: eth,
  } as Token,
  ltc: {
    address: '0x969F147B6b8D81f86175de33206A4FD43dF17913',
    decimals: 18,
    symbol: 'LTC',
    asset: ltc,
  } as Token,
  xrp: {
    address: '0x3022A32fdAdB4f02281E8Fab33e0A6811237aab0',
    decimals: 18,
    symbol: 'XRP',
    asset: xrp,
  } as Token,
  ada: {
    address: '0xcD34BC54106bd45A04Ed99EBcC2A6a3e70d7210F',
    decimals: 18,
    symbol: 'ADA',
    asset: ada,
  } as Token,
  doge: {
    address: '0x67D262CE2b8b846d9B94060BC04DC40a83F0e25B',
    decimals: 8,
    symbol: 'DOGE',
    asset: doge,
  } as Token,
  matic: {
    address: '0xcfeb0103d4BEfa041EA4c2dACce7B3E83E1aE7E3',
    decimals: 18,
    symbol: 'MATIC',
    asset: matic,
  } as Token,
  cake: {
    address: '0xe8bd7cCC165FAEb9b81569B05424771B9A20cbEF',
    decimals: 18,
    symbol: 'CAKE',
    asset: cake,
  } as Token,
  aave: {
    address: '0x4B7268FC7C727B88c5Fc127D41b491BfAe63e144',
    decimals: 18,
    symbol: 'AAVE',
    asset: aave,
  } as Token,
  tusd: {
    address: '0xFeC3A63401Eb9C1476200d7C32c4009Be0154169',
    decimals: 18,
    symbol: 'TUSD',
    asset: tusd,
  } as Token,
  trx: {
    address: '0x7D21841DC10BA1C5797951EFc62fADBBDD06704B',
    decimals: 6,
    symbol: 'TRX',
    asset: trx,
  } as Token,
  trxold: {
    address: '0x19E7215abF8B2716EE807c9f4b83Af0e7f92653F',
    decimals: 18,
    symbol: 'TRXOLD',
    asset: trx,
  } as Token,
  ust: {
    address: '0x5A79efD958432E72211ee73D5DDFa9bc8f248b5F',
    decimals: 18,
    symbol: 'UST',
    asset: ust,
  } as Token,
  luna: {
    address: '0xf36160EC62E3B191EA375dadfe465E8Fa1F8CabB',
    decimals: 6,
    symbol: 'LUNA',
    asset: luna,
  } as Token,
  vai: {
    address: '0x5fFbE5302BadED40941A403228E6AD03f93752d9',
    decimals: 18,
    symbol: 'VAI',
    asset: vai,
  } as Token,
  vrt: {
    address: '0x331F639B4F3CF6E391CD244e0b5027C5968Ec325',
    decimals: 18,
    symbol: 'VRT',
    asset: vrt,
  } as Token,
  bnx: {
    address: '0xa8062D2bd49D1D2C6376B444bde19402B38938d0',
    decimals: 18,
    symbol: 'BNX',
    asset: xvs, // TODO: add correct asset
  } as Token,
  alpaca: {
    address: '0x6923189d91fdF62dBAe623a55273F1d20306D9f2',
    decimals: 18,
    symbol: 'ALPACA',
    asset: alpaca,
  } as Token,
  ankr: {
    address: '0xe4a90EB942CF2DA7238e8F6cC9EF510c49FC8B4B',
    decimals: 18,
    symbol: 'ANKR',
    asset: ankr,
  } as Token,
  ankrbnb: {
    address: '0x167F1F9EF531b3576201aa3146b13c57dbEda514',
    decimals: 18,
    symbol: 'ankrBNB',
    asset: ankrBNB,
  } as Token,
  bifi: {
    address: '0x5B662703775171c4212F2FBAdb7F92e64116c154',
    decimals: 18,
    symbol: 'BIFI',
    asset: bifi,
  } as Token,
  bnbx: {
    address: '0x327d6E6FAC0228070884e913263CFF9eFed4a2C8',
    decimals: 18,
    symbol: 'BNBx',
    asset: bnbx,
  } as Token,
  bsw: {
    address: '0x7FCC76fc1F573d8Eb445c236Cc282246bC562bCE',
    decimals: 18,
    symbol: 'BSW',
    asset: bsw,
  } as Token,
  btt: {
    address: '0xE98344A7c691B200EF47c9b8829110087D832C64',
    decimals: 18,
    symbol: 'BTT',
    asset: btt,
  } as Token,
  floki: {
    address: '0xb22cF15FBc089d470f8e532aeAd2baB76bE87c88',
    decimals: 18,
    symbol: 'FLOKI',
    asset: floki,
  } as Token,
  hay: {
    address: '0xe73774DfCD551BF75650772dC2cC56a2B6323453',
    decimals: 18,
    symbol: 'HAY',
    asset: hay,
  } as Token,
  mobx: {
    address: '0x523027fFdf9B18Aa652dBcd6B92f885009153dA3',
    decimals: 18,
    symbol: 'MOBX',
    asset: xvs, // TODO: add correct asset
  } as Token,
  nft: {
    address: '0xc440e4F21AFc2C3bDBA1Af7D0E338ED35d3e25bA',
    decimals: 18,
    symbol: 'NFT',
    asset: nft,
  } as Token,
  raca: {
    address: '0xD60cC803d888A3e743F21D0bdE4bF2cAfdEA1F26',
    decimals: 18,
    symbol: 'RACA',
    asset: raca,
  } as Token,
  stkbnb: {
    address: '0x2999C176eBf66ecda3a646E70CeB5FF4d5fCFb8C',
    decimals: 18,
    symbol: 'stkBNB',
    asset: stkBNB,
  } as Token,
  usdd: {
    address: '0x2E2466e22FcbE0732Be385ee2FBb9C59a1098382',
    decimals: 18,
    symbol: 'USDD',
    asset: usdd,
  } as Token,
  wbnb: {
    symbol: 'WBNB',
    decimals: 18,
    address: '0xae13d989daC2f0dEbFf460aC112a837C89BAa7cd',
    asset: wbnb,
  } as Token,
  win: {
    address: '0x2E6Af3f3F059F43D764060968658c9F3c8f9479D',
    decimals: 18,
    symbol: 'WIN',
    asset: win,
  } as Token,
  woo: {
    address: '0x65B849A4Fc306AF413E341D44dF8482F963fBB91',
    decimals: 18,
    symbol: 'WOO',
    asset: woo,
  } as Token,
  wbeth: {
    address: '0xf9F98365566F4D55234f24b99caA1AfBE6428D44',
    decimals: 18,
    symbol: 'WBETH',
    asset: wbeth,
  } as Token,
};
