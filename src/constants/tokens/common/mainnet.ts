import { Token } from 'types';

import aave from 'assets/img/tokens/aave.svg';
import ada from 'assets/img/tokens/ada.svg';
import alpaca from 'assets/img/tokens/alpaca.svg';
import ankr from 'assets/img/tokens/ankr.svg';
import ankrbnb from 'assets/img/tokens/ankrBNB.svg';
import bch from 'assets/img/tokens/bch.svg';
import beth from 'assets/img/tokens/beth.svg';
import bifi from 'assets/img/tokens/bifi.png';
import bnb from 'assets/img/tokens/bnb.svg';
import bnbx from 'assets/img/tokens/bnbx.png';
import bsw from 'assets/img/tokens/bsw.svg';
import btcb from 'assets/img/tokens/btcb.svg';
import btt from 'assets/img/tokens/btt.svg';
import busd from 'assets/img/tokens/busd.svg';
import cake from 'assets/img/tokens/cake.svg';
import dai from 'assets/img/tokens/dai.svg';
import doge from 'assets/img/tokens/doge.svg';
import dot from 'assets/img/tokens/dot.svg';
import eth from 'assets/img/tokens/eth.svg';
import fil from 'assets/img/tokens/fil.svg';
import floki from 'assets/img/tokens/floki.svg';
import hay from 'assets/img/tokens/hay.png';
import link from 'assets/img/tokens/link.svg';
import ltc from 'assets/img/tokens/ltc.svg';
import luna from 'assets/img/tokens/luna.svg';
import matic from 'assets/img/tokens/matic.svg';
import nft from 'assets/img/tokens/nft.png';
import raca from 'assets/img/tokens/raca.png';
import stkbnb from 'assets/img/tokens/stkBNB.svg';
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
import xrp from 'assets/img/tokens/xrp.svg';
import xvs from 'assets/img/tokens/xvs.svg';

export const MAINNET_TOKENS = {
  bnb: {
    address: '',
    decimals: 18,
    symbol: 'BNB',
    asset: bnb,
    isNative: true,
  } as Token,
  sxp: {
    address: '0x47BEAd2563dCBf3bF2c9407fEa4dC236fAbA485A',
    decimals: 18,
    symbol: 'SXP',
    asset: sxp,
  } as Token,
  usdc: {
    address: '0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d',
    decimals: 18,
    symbol: 'USDC',
    asset: usdc,
  } as Token,
  usdt: {
    address: '0x55d398326f99059fF775485246999027B3197955',
    decimals: 18,
    symbol: 'USDT',
    asset: usdt,
  } as Token,
  busd: {
    address: '0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56',
    decimals: 18,
    symbol: 'BUSD',
    asset: busd,
  } as Token,
  xvs: {
    address: '0xcF6BB5389c92Bdda8a3747Ddb454cB7a64626C63',
    decimals: 18,
    symbol: 'XVS',
    asset: xvs,
  } as Token,
  btcb: {
    address: '0x7130d2A12B9BCbFAe4f2634d864A1Ee1Ce3Ead9c',
    decimals: 18,
    symbol: 'BTCB',
    asset: btcb,
  } as Token,
  eth: {
    address: '0x2170Ed0880ac9A755fd29B2688956BD959F933F8',
    decimals: 18,
    symbol: 'ETH',
    asset: eth,
  } as Token,
  ltc: {
    address: '0x4338665CBB7B2485A8855A139b75D5e34AB0DB94',
    decimals: 18,
    symbol: 'LTC',
    asset: ltc,
  } as Token,
  xrp: {
    address: '0x1D2F0da169ceB9fC7B3144628dB156f3F6c60dBE',
    decimals: 18,
    symbol: 'XRP',
    asset: xrp,
  } as Token,
  bch: {
    address: '0x8fF795a6F4D97E7887C79beA79aba5cc76444aDf',
    decimals: 18,
    symbol: 'BCH',
    asset: bch,
  } as Token,
  dot: {
    address: '0x7083609fCE4d1d8Dc0C979AAb8c869Ea2C873402',
    decimals: 18,
    symbol: 'DOT',
    asset: dot,
  } as Token,
  link: {
    address: '0xF8A0BF9cF54Bb92F17374d9e9A321E6a111a51bD',
    decimals: 18,
    symbol: 'LINK',
    asset: link,
  } as Token,
  dai: {
    address: '0x1AF3F329e8BE154074D8769D1FFa4eE058B1DBc3',
    decimals: 18,
    symbol: 'DAI',
    asset: dai,
  } as Token,
  fil: {
    address: '0x0D8Ce2A99Bb6e3B7Db580eD848240e4a0F9aE153',
    decimals: 18,
    symbol: 'FIL',
    asset: fil,
  } as Token,
  beth: {
    address: '0x250632378E573c6Be1AC2f97Fcdf00515d0Aa91B',
    decimals: 18,
    symbol: 'BETH',
    asset: beth,
  } as Token,
  ada: {
    address: '0x3EE2200Efb3400fAbB9AacF31297cBdD1d435D47',
    decimals: 18,
    symbol: 'ADA',
    asset: ada,
  } as Token,
  doge: {
    address: '0xbA2aE424d960c26247Dd6c32edC70B295c744C43',
    decimals: 8,
    symbol: 'DOGE',
    asset: doge,
  } as Token,
  matic: {
    address: '0xcc42724c6683b7e57334c4e856f4c9965ed682bd',
    decimals: 18,
    symbol: 'MATIC',
    asset: matic,
  } as Token,
  cake: {
    address: '0x0E09FaBB73Bd3Ade0a17ECC321fD13a19e81cE82',
    decimals: 18,
    symbol: 'CAKE',
    asset: cake,
  } as Token,
  aave: {
    address: '0xfb6115445Bff7b52FeB98650C87f44907E58f802',
    decimals: 18,
    symbol: 'AAVE',
    asset: aave,
  } as Token,
  tusd: {
    address: '0x40af3827F39D0EAcBF4A168f8D4ee67c121D11c9',
    decimals: 18,
    symbol: 'TUSD',
    asset: tusd,
  } as Token,
  tusdold: {
    address: '0x14016e85a25aeb13065688cafb43044c2ef86784',
    decimals: 18,
    symbol: 'TUSDOLD',
    asset: tusd,
  } as Token,
  trx: {
    address: '0xCE7de646e7208a4Ef112cb6ed5038FA6cC6b12e3',
    decimals: 6,
    symbol: 'TRX',
    asset: trx,
  } as Token,
  trxold: {
    address: '0x85EAC5Ac2F758618dFa09bDbe0cf174e7d574D5B',
    decimals: 18,
    symbol: 'TRXOLD',
    asset: trx,
  } as Token,
  vai: {
    address: '0x4BD17003473389A42DAF6a0a729f6Fdb328BbBd7',
    decimals: 18,
    symbol: 'VAI',
    asset: vai,
  } as Token,
  vrt: {
    address: '0x5f84ce30dc3cf7909101c69086c50de191895883',
    decimals: 18,
    symbol: 'VRT',
    asset: vrt,
  } as Token,
  ust: {
    address: '0x3d4350cD54aeF9f9b2C29435e0fa809957B3F30a',
    decimals: 6,
    symbol: 'UST',
    asset: ust,
  } as Token,
  luna: {
    address: '0x156ab3346823B651294766e23e6Cf87254d68962',
    decimals: 6,
    symbol: 'LUNA',
    asset: luna,
  } as Token,
  wbeth: {
    address: '0xa2E3356610840701BDf5611a53974510Ae27E2e1',
    decimals: 18,
    symbol: 'WBETH',
    asset: wbeth,
  } as Token,
  hay: {
    address: '0x0782b6d8c4551B9760e74c0545a9bCD90bdc41E5',
    decimals: 18,
    symbol: 'HAY',
    asset: hay,
  } as Token,
  usdd: {
    address: '0xd17479997F34dd9156Deef8F95A52D81D265be9c',
    decimals: 18,
    symbol: 'USDD',
    asset: usdd,
  } as Token,
  // Underlying tokens for isolated markets
  btt: {
    address: '0x352Cb5E19b12FC216548a2677bD0fce83BaE434B',
    decimals: 18,
    symbol: 'BTT',
    asset: btt,
  } as Token,
  nft: {
    address: '0x20eE7B720f4E4c4FFcB00C4065cdae55271aECCa',
    decimals: 18,
    symbol: 'NFT',
    asset: nft,
  } as Token,
  win: {
    address: '0xaeF0d72a118ce24feE3cD1d43d383897D05B4e99',
    decimals: 18,
    symbol: 'WIN',
    asset: win,
  } as Token,
  raca: {
    address: '0x12BB890508c125661E03b09EC06E404bc9289040',
    decimals: 18,
    symbol: 'RACA',
    asset: raca,
  } as Token,
  floki: {
    address: '0xfb5B838b6cfEEdC2873aB27866079AC55363D37E',
    decimals: 18,
    symbol: 'FLOKI',
    asset: floki,
  } as Token,
  bifi: {
    address: '0xCa3F508B8e4Dd382eE878A314789373D80A5190A',
    decimals: 18,
    symbol: 'BIFI',
    asset: bifi,
  } as Token,
  bsw: {
    address: '0x965F527D9159dCe6288a2219DB51fc6Eef120dD1',
    decimals: 18,
    symbol: 'BSW',
    asset: bsw,
  } as Token,
  alpaca: {
    address: '0x8F0528cE5eF7B51152A59745bEfDD91D97091d2F',
    decimals: 18,
    symbol: 'ALPACA',
    asset: alpaca,
  } as Token,
  ankr: {
    address: '0xf307910A4c7bbc79691fD374889b36d8531B08e3',
    decimals: 18,
    symbol: 'ANKR',
    asset: ankr,
  } as Token,
  ankrbnb: {
    address: '0x52F24a5e03aee338Da5fd9Df68D2b6FAe1178827',
    decimals: 18,
    symbol: 'ankrBNB',
    asset: ankrbnb,
  } as Token,
  bnbx: {
    address: '0x1bdd3Cf7F79cfB8EdbB955f20ad99211551BA275',
    decimals: 18,
    symbol: 'BNBx',
    asset: bnbx,
  } as Token,
  stkbnb: {
    address: '0xc2E9d07F66A89c44062459A47a0D2Dc038E4fb16',
    decimals: 18,
    symbol: 'stkBNB',
    asset: stkbnb,
  } as Token,
  wbnb: {
    address: '0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c',
    decimals: 18,
    symbol: 'WBNB',
    asset: wbnb,
  } as Token,
};
