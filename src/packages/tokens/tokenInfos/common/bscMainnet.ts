import aaveLogo from 'packages/tokens/img/aave.svg';
import adaLogo from 'packages/tokens/img/ada.svg';
import alpacaLogo from 'packages/tokens/img/alpaca.svg';
import ankrLogo from 'packages/tokens/img/ankr.svg';
import ankrbnbLogo from 'packages/tokens/img/ankrBNB.svg';
import bchLogo from 'packages/tokens/img/bch.svg';
import bethLogo from 'packages/tokens/img/beth.svg';
import bifiLogo from 'packages/tokens/img/bifi.png';
import bnbLogo from 'packages/tokens/img/bnb.svg';
import bnbxLogo from 'packages/tokens/img/bnbx.png';
import bswLogo from 'packages/tokens/img/bsw.svg';
import btcbLogo from 'packages/tokens/img/btcb.svg';
import bttLogo from 'packages/tokens/img/btt.svg';
import busdLogo from 'packages/tokens/img/busd.svg';
import cakeLogo from 'packages/tokens/img/cake.svg';
import daiLogo from 'packages/tokens/img/dai.svg';
import dogeLogo from 'packages/tokens/img/doge.svg';
import dotLogo from 'packages/tokens/img/dot.svg';
import ethLogo from 'packages/tokens/img/eth.svg';
import filLogo from 'packages/tokens/img/fil.svg';
import flokiLogo from 'packages/tokens/img/floki.svg';
import hayLogo from 'packages/tokens/img/hay.png';
import linkLogo from 'packages/tokens/img/link.svg';
import ltcLogo from 'packages/tokens/img/ltc.svg';
import lunaLogo from 'packages/tokens/img/luna.svg';
import maticLogo from 'packages/tokens/img/matic.svg';
import nftLogo from 'packages/tokens/img/nft.png';
import racaLogo from 'packages/tokens/img/raca.png';
import sdLogo from 'packages/tokens/img/sd.svg';
import stkbnbLogo from 'packages/tokens/img/stkBNB.svg';
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
import xrpLogo from 'packages/tokens/img/xrp.svg';
import xvsLogo from 'packages/tokens/img/xvs.svg';
import { Token } from 'types';

export const tokens: Token[] = [
  {
    address: '0x0000000000000000000000000000000000000000',
    decimals: 18,
    symbol: 'BNB',
    asset: bnbLogo,
    isNative: true,
  },
  {
    address: '0x47BEAd2563dCBf3bF2c9407fEa4dC236fAbA485A',
    decimals: 18,
    symbol: 'SXP',
    asset: sxpLogo,
  },
  {
    address: '0x0000000000000000000000000000000000000000',
    decimals: 18,
    symbol: 'BNB',
    asset: bnbLogo,
    isNative: true,
  },
  {
    address: '0x47BEAd2563dCBf3bF2c9407fEa4dC236fAbA485A',
    decimals: 18,
    symbol: 'SXP',
    asset: sxpLogo,
  },
  {
    address: '0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d',
    decimals: 18,
    symbol: 'USDC',
    asset: usdcLogo,
  },
  {
    address: '0x55d398326f99059fF775485246999027B3197955',
    decimals: 18,
    symbol: 'USDT',
    asset: usdtLogo,
  },
  {
    address: '0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56',
    decimals: 18,
    symbol: 'BUSD',
    asset: busdLogo,
  },
  {
    address: '0xcF6BB5389c92Bdda8a3747Ddb454cB7a64626C63',
    decimals: 18,
    symbol: 'XVS',
    asset: xvsLogo,
  },
  {
    address: '0x7130d2A12B9BCbFAe4f2634d864A1Ee1Ce3Ead9c',
    decimals: 18,
    symbol: 'BTCB',
    asset: btcbLogo,
  },
  {
    address: '0x2170Ed0880ac9A755fd29B2688956BD959F933F8',
    decimals: 18,
    symbol: 'ETH',
    asset: ethLogo,
  },
  {
    address: '0x4338665CBB7B2485A8855A139b75D5e34AB0DB94',
    decimals: 18,
    symbol: 'LTC',
    asset: ltcLogo,
  },
  {
    address: '0x1D2F0da169ceB9fC7B3144628dB156f3F6c60dBE',
    decimals: 18,
    symbol: 'XRP',
    asset: xrpLogo,
  },
  {
    address: '0x8fF795a6F4D97E7887C79beA79aba5cc76444aDf',
    decimals: 18,
    symbol: 'BCH',
    asset: bchLogo,
  },
  {
    address: '0x7083609fCE4d1d8Dc0C979AAb8c869Ea2C873402',
    decimals: 18,
    symbol: 'DOT',
    asset: dotLogo,
  },
  {
    address: '0xF8A0BF9cF54Bb92F17374d9e9A321E6a111a51bD',
    decimals: 18,
    symbol: 'LINK',
    asset: linkLogo,
  },
  {
    address: '0x1AF3F329e8BE154074D8769D1FFa4eE058B1DBc3',
    decimals: 18,
    symbol: 'DAI',
    asset: daiLogo,
  },
  {
    address: '0x0D8Ce2A99Bb6e3B7Db580eD848240e4a0F9aE153',
    decimals: 18,
    symbol: 'FIL',
    asset: filLogo,
  },
  {
    address: '0x250632378E573c6Be1AC2f97Fcdf00515d0Aa91B',
    decimals: 18,
    symbol: 'BETH',
    asset: bethLogo,
  },
  {
    address: '0x3EE2200Efb3400fAbB9AacF31297cBdD1d435D47',
    decimals: 18,
    symbol: 'ADA',
    asset: adaLogo,
  },
  {
    address: '0xbA2aE424d960c26247Dd6c32edC70B295c744C43',
    decimals: 8,
    symbol: 'DOGE',
    asset: dogeLogo,
  },
  {
    address: '0xcc42724c6683b7e57334c4e856f4c9965ed682bd',
    decimals: 18,
    symbol: 'MATIC',
    asset: maticLogo,
  },
  {
    address: '0x0E09FaBB73Bd3Ade0a17ECC321fD13a19e81cE82',
    decimals: 18,
    symbol: 'CAKE',
    asset: cakeLogo,
  },
  {
    address: '0xfb6115445Bff7b52FeB98650C87f44907E58f802',
    decimals: 18,
    symbol: 'AAVE',
    asset: aaveLogo,
  },
  {
    address: '0x40af3827F39D0EAcBF4A168f8D4ee67c121D11c9',
    decimals: 18,
    symbol: 'TUSD',
    asset: tusdLogo,
  },
  {
    address: '0x14016e85a25aeb13065688cafb43044c2ef86784',
    decimals: 18,
    symbol: 'TUSDOLD',
    asset: tusdLogo,
  },
  {
    address: '0xCE7de646e7208a4Ef112cb6ed5038FA6cC6b12e3',
    decimals: 6,
    symbol: 'TRX',
    asset: trxLogo,
  },
  {
    address: '0x85EAC5Ac2F758618dFa09bDbe0cf174e7d574D5B',
    decimals: 18,
    symbol: 'TRXOLD',
    asset: trxLogo,
  },
  {
    address: '0x4BD17003473389A42DAF6a0a729f6Fdb328BbBd7',
    decimals: 18,
    symbol: 'VAI',
    asset: vaiLogo,
  },
  {
    address: '0x5f84ce30dc3cf7909101c69086c50de191895883',
    decimals: 18,
    symbol: 'VRT',
    asset: vrtLogo,
  },
  {
    address: '0x3d4350cD54aeF9f9b2C29435e0fa809957B3F30a',
    decimals: 6,
    symbol: 'UST',
    asset: ustLogo,
  },
  {
    address: '0x156ab3346823B651294766e23e6Cf87254d68962',
    decimals: 6,
    symbol: 'LUNA',
    asset: lunaLogo,
  },
  {
    address: '0xa2E3356610840701BDf5611a53974510Ae27E2e1',
    decimals: 18,
    symbol: 'WBETH',
    asset: wbethLogo,
  },
  {
    address: '0x0782b6d8c4551B9760e74c0545a9bCD90bdc41E5',
    decimals: 18,
    symbol: 'HAY',
    asset: hayLogo,
  },
  {
    address: '0xd17479997F34dd9156Deef8F95A52D81D265be9c',
    decimals: 18,
    symbol: 'USDD',
    asset: usddLogo,
  },
  {
    address: '0x352Cb5E19b12FC216548a2677bD0fce83BaE434B',
    decimals: 18,
    symbol: 'BTT',
    asset: bttLogo,
  },
  {
    address: '0x20eE7B720f4E4c4FFcB00C4065cdae55271aECCa',
    decimals: 18,
    symbol: 'NFT',
    asset: nftLogo,
  },
  {
    address: '0xaeF0d72a118ce24feE3cD1d43d383897D05B4e99',
    decimals: 18,
    symbol: 'WIN',
    asset: winLogo,
  },
  {
    address: '0x12BB890508c125661E03b09EC06E404bc9289040',
    decimals: 18,
    symbol: 'RACA',
    asset: racaLogo,
  },
  {
    address: '0xfb5B838b6cfEEdC2873aB27866079AC55363D37E',
    decimals: 9,
    symbol: 'FLOKI',
    asset: flokiLogo,
  },
  {
    address: '0xCa3F508B8e4Dd382eE878A314789373D80A5190A',
    decimals: 18,
    symbol: 'BIFI',
    asset: bifiLogo,
  },
  {
    address: '0x965F527D9159dCe6288a2219DB51fc6Eef120dD1',
    decimals: 18,
    symbol: 'BSW',
    asset: bswLogo,
  },
  {
    address: '0x8F0528cE5eF7B51152A59745bEfDD91D97091d2F',
    decimals: 18,
    symbol: 'ALPACA',
    asset: alpacaLogo,
  },
  {
    address: '0xf307910A4c7bbc79691fD374889b36d8531B08e3',
    decimals: 18,
    symbol: 'ANKR',
    asset: ankrLogo,
  },
  {
    address: '0x52F24a5e03aee338Da5fd9Df68D2b6FAe1178827',
    decimals: 18,
    symbol: 'ankrBNB',
    asset: ankrbnbLogo,
  },
  {
    address: '0x1bdd3Cf7F79cfB8EdbB955f20ad99211551BA275',
    decimals: 18,
    symbol: 'BNBx',
    asset: bnbxLogo,
  },
  {
    address: '0xc2E9d07F66A89c44062459A47a0D2Dc038E4fb16',
    decimals: 18,
    symbol: 'stkBNB',
    asset: stkbnbLogo,
  },
  {
    address: '0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c',
    decimals: 18,
    symbol: 'WBNB',
    asset: wbnbLogo,
  },
  {
    address: '0x3BC5AC0dFdC871B365d159f728dd1B9A0B5481E8',
    decimals: 18,
    symbol: 'SD',
    asset: sdLogo,
  },
  {
    address: '0x4b0f1812e5df2a09796481ff14017e6005508003',
    decimals: 18,
    symbol: 'TWT',
    asset: twtLogo,
  },
  {
    address: '0xF4C8E32EaDEC4BFe97E0F595AdD0f4450a863a11',
    decimals: 18,
    symbol: 'THE',
    asset: theLogo,
  },
];
