import config from 'config';
import { Token } from 'types';

import aave from 'assets/img/tokens/aave.png';
import ada from 'assets/img/tokens/ada.png';
import bch from 'assets/img/tokens/bch.png';
import beth from 'assets/img/tokens/beth.png';
import bnb from 'assets/img/tokens/bnb.png';
import btc from 'assets/img/tokens/btc.png';
import busd from 'assets/img/tokens/busd.png';
import cake from 'assets/img/tokens/cake.png';
import dai from 'assets/img/tokens/dai.png';
import doge from 'assets/img/tokens/doge.png';
import dot from 'assets/img/tokens/dot.png';
import eth from 'assets/img/tokens/eth.png';
import fil from 'assets/img/tokens/fil.png';
import link from 'assets/img/tokens/link.png';
import ltc from 'assets/img/tokens/ltc.png';
import luna from 'assets/img/tokens/luna.png';
import matic from 'assets/img/tokens/matic.png';
import sxp from 'assets/img/tokens/sxp.png';
import trx from 'assets/img/tokens/trx.png';
import tusd from 'assets/img/tokens/tusd.png';
import usdc from 'assets/img/tokens/usdc.png';
import usdt from 'assets/img/tokens/usdt.png';
import ust from 'assets/img/tokens/ust.png';
import vaave from 'assets/img/tokens/vaave.png';
import vada from 'assets/img/tokens/vada.png';
import vai from 'assets/img/tokens/vai.svg';
import vbch from 'assets/img/tokens/vbch.png';
import vbeth from 'assets/img/tokens/vbeth.png';
import vbnb from 'assets/img/tokens/vbnb.png';
import vbtc from 'assets/img/tokens/vbtc.png';
import vbusd from 'assets/img/tokens/vbusd.png';
import vcake from 'assets/img/tokens/vcake.png';
import vdai from 'assets/img/tokens/vdai.png';
import vdoge from 'assets/img/tokens/vdoge.png';
import vdot from 'assets/img/tokens/vdot.png';
import veth from 'assets/img/tokens/veth.png';
import vfil from 'assets/img/tokens/vfil.png';
import vlink from 'assets/img/tokens/vlink.png';
import vltc from 'assets/img/tokens/vltc.png';
import vluna from 'assets/img/tokens/vluna.png';
import vmatic from 'assets/img/tokens/vmatic.png';
import vrt from 'assets/img/tokens/vrt.svg';
import vsxp from 'assets/img/tokens/vsxp.png';
import vtrx from 'assets/img/tokens/vtrx.png';
import vtusd from 'assets/img/tokens/vtusd.png';
import vusdc from 'assets/img/tokens/vusdc.png';
import vusdt from 'assets/img/tokens/vusdt.png';
import vust from 'assets/img/tokens/vust.png';
import vxrp from 'assets/img/tokens/vxrp.png';
import vxvs from 'assets/img/tokens/vxvs.png';
import xrp from 'assets/img/tokens/xrp.png';
import xvs from 'assets/img/tokens/xvs.svg';

import TOKEN_ADDRESSES from './contracts/addresses/tokens.json';
import VBEP_TOKEN_ADDRESSES from './contracts/addresses/vBepTokens.json';

// TODO: update to give strict type and move to separate file
// TODO: handle mainnet
export const PANCAKE_SWAP_TOKENS = {
  cake: {
    id: 'cake',
    symbol: 'CAKE',
    decimals: 18,
    address: '0xFa60D973F7642B748046464e165A65B7323b0DEE',
    asset:
      'https://pancakeswap.finance/images/tokens/0x0E09FaBB73Bd3Ade0a17ECC321fD13a19e81cE82.png',
  } as Token,
  busd: {
    id: 'busd',
    symbol: 'BUSD',
    decimals: 18,
    address: '0xaB1a4d4f1D656d2450692D237fdD6C7f9146e814',
    asset:
      'https://pancakeswap.finance/images/tokens/0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56.png',
  } as Token,
  wbnb: {
    id: 'wbnb',
    symbol: 'WBNB',
    decimals: 18,
    address: '0xae13d989daC2f0dEbFf460aC112a837C89BAa7cd',
    asset:
      'https://pancakeswap.finance/images/tokens/0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c.png',
  } as Token,
  // TODO: add other tokens
};

// TODO: update to give strict type
export const TOKENS = config.isOnTestnet
  ? {
      sxp: {
        id: 'sxp',
        symbol: 'SXP',
        decimals: 18,
        address: TOKEN_ADDRESSES.sxp[97],
        asset: sxp,
        vasset: vsxp,
      } as Token,
      usdc: {
        id: 'usdc',
        symbol: 'USDC',
        decimals: 6,
        address: TOKEN_ADDRESSES.usdc[97],
        asset: usdc,
        vasset: vusdc,
      } as Token,
      usdt: {
        id: 'usdt',
        symbol: 'USDT',
        decimals: 6,
        address: TOKEN_ADDRESSES.usdt[97],
        asset: usdt,
        vasset: vusdt,
      } as Token,
      busd: {
        id: 'busd',
        symbol: 'BUSD',
        decimals: 18,
        address: TOKEN_ADDRESSES.busd[97],
        asset: busd,
        vasset: vbusd,
      } as Token,
      bnb: {
        id: 'bnb',
        symbol: 'BNB',
        decimals: 18,
        address: TOKEN_ADDRESSES.bnb[97],
        asset: bnb,
        vasset: vbnb,
      } as Token,
      xvs: {
        id: 'xvs',
        symbol: 'XVS',
        decimals: 18,
        address: TOKEN_ADDRESSES.xvs[97],
        asset: xvs,
        vasset: vxvs,
      } as Token,
      btcb: {
        id: 'btcb',
        symbol: 'BTCB',
        decimals: 18,
        address: TOKEN_ADDRESSES.btcb[97],
        asset: btc,
        vasset: vbtc,
      } as Token,
      eth: {
        id: 'eth',
        symbol: 'ETH',
        decimals: 18,
        address: TOKEN_ADDRESSES.eth[97],
        asset: eth,
        vasset: veth,
      } as Token,
      ltc: {
        id: 'ltc',
        symbol: 'LTC',
        decimals: 18,
        address: TOKEN_ADDRESSES.ltc[97],
        asset: ltc,
        vasset: vltc,
      } as Token,
      xrp: {
        id: 'xrp',
        symbol: 'XRP',
        decimals: 18,
        address: TOKEN_ADDRESSES.xrp[97],
        asset: xrp,
        vasset: vxrp,
      } as Token,
      ada: {
        id: 'ada',
        symbol: 'ADA',
        decimals: 18,
        address: TOKEN_ADDRESSES.ada[97],
        asset: ada,
        vasset: vada,
      } as Token,
      doge: {
        id: 'doge',
        symbol: 'DOGE',
        decimals: 8,
        address: TOKEN_ADDRESSES.doge[97],
        asset: doge,
        vasset: vdoge,
      } as Token,
      matic: {
        id: 'matic',
        symbol: 'MATIC',
        decimals: 18,
        address: TOKEN_ADDRESSES.matic[97],
        asset: matic,
        vasset: vmatic,
      } as Token,
      cake: {
        id: 'cake',
        symbol: 'CAKE',
        decimals: 18,
        address: TOKEN_ADDRESSES.cake[97],
        asset: cake,
        vasset: vcake,
      } as Token,
      aave: {
        id: 'aave',
        symbol: 'AAVE',
        decimals: 18,
        address: TOKEN_ADDRESSES.aave[97],
        asset: aave,
        vasset: vaave,
      } as Token,
      tusd: {
        id: 'tusd',
        symbol: 'TUSD',
        decimals: 18,
        address: TOKEN_ADDRESSES.tusd[97],
        asset: tusd,
        vasset: vtusd,
      } as Token,
      trx: {
        id: 'trx',
        symbol: 'TRX',
        decimals: 18,
        address: TOKEN_ADDRESSES.trx[97],
        asset: trx,
        vasset: vtrx,
      } as Token,
      ust: {
        id: 'ust',
        symbol: 'UST',
        decimals: 18,
        address: TOKEN_ADDRESSES.ust[97],
        asset: ust,
        vasset: vust,
      } as Token,
      luna: {
        id: 'luna',
        symbol: 'LUNA',
        decimals: 6,
        address: TOKEN_ADDRESSES.luna[97],
        asset: luna,
        vasset: vluna,
      } as Token,
      vai: {
        id: 'vai',
        symbol: 'VAI',
        decimals: 18,
        address: TOKEN_ADDRESSES.vai[97],
        asset: vai,
      } as Token,
      vrt: {
        id: 'vrt',
        symbol: 'VRT',
        decimals: 18,
        address: TOKEN_ADDRESSES.vrt[97],
        asset: vrt,
      } as Token,
    }
  : {
      sxp: {
        id: 'sxp',
        symbol: 'SXP',
        decimals: 18,
        address: TOKEN_ADDRESSES.sxp[56],
        asset: sxp,
        vasset: vsxp,
      } as Token,
      usdc: {
        id: 'usdc',
        symbol: 'USDC',
        decimals: 18,
        address: TOKEN_ADDRESSES.usdc[56],
        asset: usdc,
        vasset: vusdc,
      } as Token,
      usdt: {
        id: 'usdt',
        symbol: 'USDT',
        decimals: 18,
        address: TOKEN_ADDRESSES.usdt[56],
        asset: usdt,
        vasset: vusdt,
      } as Token,
      busd: {
        id: 'busd',
        symbol: 'BUSD',
        decimals: 18,
        address: TOKEN_ADDRESSES.busd[56],
        asset: busd,
        vasset: vbusd,
      } as Token,
      bnb: {
        id: 'bnb',
        symbol: 'BNB',
        decimals: 18,
        address: '',
        asset: bnb,
        vasset: vbnb,
      } as Token,
      xvs: {
        id: 'xvs',
        symbol: 'XVS',
        decimals: 18,
        address: TOKEN_ADDRESSES.xvs[56],
        asset: xvs,
        vasset: vxvs,
      } as Token,
      btcb: {
        id: 'btcb',
        symbol: 'BTCB',
        decimals: 18,
        address: TOKEN_ADDRESSES.btcb[56],
        asset: btc,
        vasset: vbtc,
      } as Token,
      eth: {
        id: 'eth',
        symbol: 'ETH',
        decimals: 18,
        address: TOKEN_ADDRESSES.eth[56],
        asset: eth,
        vasset: veth,
      } as Token,
      ltc: {
        id: 'ltc',
        symbol: 'LTC',
        decimals: 18,
        address: TOKEN_ADDRESSES.ltc[56],
        asset: ltc,
        vasset: vltc,
      } as Token,
      xrp: {
        id: 'xrp',
        symbol: 'XRP',
        decimals: 18,
        address: TOKEN_ADDRESSES.xrp[56],
        asset: xrp,
        vasset: vxrp,
      } as Token,
      bch: {
        id: 'bch',
        symbol: 'BCH',
        decimals: 18,
        address: TOKEN_ADDRESSES.bch[56],
        asset: bch,
        vasset: vbch,
      } as Token,
      dot: {
        id: 'dot',
        symbol: 'DOT',
        decimals: 18,
        address: TOKEN_ADDRESSES.dot[56],
        asset: dot,
        vasset: vdot,
      } as Token,
      link: {
        id: 'link',
        symbol: 'LINK',
        decimals: 18,
        address: TOKEN_ADDRESSES.link[56],
        asset: link,
        vasset: vlink,
      } as Token,
      dai: {
        id: 'dai',
        symbol: 'DAI',
        decimals: 18,
        address: TOKEN_ADDRESSES.dai[56],
        asset: dai,
        vasset: vdai,
      } as Token,
      fil: {
        id: 'fil',
        symbol: 'FIL',
        decimals: 18,
        address: TOKEN_ADDRESSES.fil[56],
        asset: fil,
        vasset: vfil,
      } as Token,
      beth: {
        id: 'beth',
        symbol: 'BETH',
        decimals: 18,
        address: TOKEN_ADDRESSES.beth[56],
        asset: beth,
        vasset: vbeth,
      } as Token,
      ada: {
        id: 'ada',
        symbol: 'ADA',
        decimals: 18,
        address: TOKEN_ADDRESSES.ada[56],
        asset: ada,
        vasset: vada,
      } as Token,
      doge: {
        id: 'doge',
        symbol: 'DOGE',
        decimals: 8,
        address: TOKEN_ADDRESSES.doge[56],
        asset: doge,
        vasset: vdoge,
      } as Token,
      matic: {
        id: 'matic',
        symbol: 'MATIC',
        decimals: 18,
        address: TOKEN_ADDRESSES.matic[56],
        asset: matic,
        vasset: vmatic,
      } as Token,
      cake: {
        id: 'cake',
        symbol: 'CAKE',
        decimals: 18,
        address: TOKEN_ADDRESSES.cake[56],
        asset: cake,
        vasset: vcake,
      } as Token,
      aave: {
        id: 'aave',
        symbol: 'AAVE',
        decimals: 18,
        address: TOKEN_ADDRESSES.aave[56],
        asset: aave,
        vasset: vaave,
      } as Token,
      tusd: {
        id: 'tusd',
        symbol: 'TUSD',
        decimals: 18,
        address: TOKEN_ADDRESSES.tusd[56],
        asset: tusd,
        vasset: vtusd,
      } as Token,
      trx: {
        id: 'trx',
        symbol: 'TRX',
        decimals: 18,
        address: TOKEN_ADDRESSES.trx[56],
        asset: trx,
        vasset: vtrx,
      } as Token,
      vai: {
        id: 'vai',
        symbol: 'VAI',
        decimals: 18,
        address: TOKEN_ADDRESSES.vai[56],
        asset: vai,
      } as Token,
      vrt: {
        id: 'vrt',
        symbol: 'VRT',
        decimals: 18,
        address: TOKEN_ADDRESSES.vrt[56],
        asset: vrt,
      } as Token,
      ust: {
        id: 'ust',
        symbol: 'UST',
        decimals: 6,
        address: TOKEN_ADDRESSES.ust[56],
        asset: ust,
        vasset: vust,
      } as Token,
      luna: {
        id: 'luna',
        symbol: 'LUNA',
        decimals: 6,
        address: TOKEN_ADDRESSES.luna[56],
        asset: luna,
        vasset: vluna,
      } as Token,
    };

export const VBEP_TOKEN_DECIMALS = 8;

export const VBEP_TOKENS = config.isOnTestnet
  ? {
      sxp: {
        id: 'sxp',
        symbol: 'vSXP',
        address: VBEP_TOKEN_ADDRESSES.sxp[97],
        decimals: VBEP_TOKEN_DECIMALS,
      } as Token,
      usdc: {
        id: 'usdc',
        symbol: 'vUSDC',
        address: VBEP_TOKEN_ADDRESSES.usdc[97],
        decimals: VBEP_TOKEN_DECIMALS,
      } as Token,
      usdt: {
        id: 'usdt',
        symbol: 'vUSDT',
        address: VBEP_TOKEN_ADDRESSES.usdt[97],
        decimals: VBEP_TOKEN_DECIMALS,
      } as Token,
      busd: {
        id: 'busd',
        symbol: 'vBUSD',
        address: VBEP_TOKEN_ADDRESSES.busd[97],
        decimals: VBEP_TOKEN_DECIMALS,
      } as Token,
      bnb: {
        id: 'bnb',
        symbol: 'vBNB',
        address: VBEP_TOKEN_ADDRESSES.bnb[97],
        decimals: VBEP_TOKEN_DECIMALS,
      } as Token,
      xvs: {
        id: 'xvs',
        symbol: 'vXVS',
        address: VBEP_TOKEN_ADDRESSES.xvs[97],
        decimals: VBEP_TOKEN_DECIMALS,
      } as Token,
      btcb: {
        id: 'btcb',
        symbol: 'vBTC',
        address: VBEP_TOKEN_ADDRESSES.btcb[97],
        decimals: VBEP_TOKEN_DECIMALS,
      } as Token,
      eth: {
        id: 'eth',
        symbol: 'vETH',
        address: VBEP_TOKEN_ADDRESSES.eth[97],
        decimals: VBEP_TOKEN_DECIMALS,
      } as Token,
      ltc: {
        id: 'ltc',
        symbol: 'vLTC',
        address: VBEP_TOKEN_ADDRESSES.ltc[97],
        decimals: VBEP_TOKEN_DECIMALS,
      } as Token,
      xrp: {
        id: 'xrp',
        symbol: 'vXRP',
        address: VBEP_TOKEN_ADDRESSES.xrp[97],
        decimals: VBEP_TOKEN_DECIMALS,
      } as Token,
      ada: {
        id: 'ada',
        symbol: 'vADA',
        address: VBEP_TOKEN_ADDRESSES.ada[97],
        decimals: VBEP_TOKEN_DECIMALS,
      } as Token,
      doge: {
        id: 'doge',
        symbol: 'vDOGE',
        address: VBEP_TOKEN_ADDRESSES.doge[97],
        decimals: VBEP_TOKEN_DECIMALS,
      } as Token,
      matic: {
        id: 'matic',
        symbol: 'vMATIC',
        address: VBEP_TOKEN_ADDRESSES.matic[97],
        decimals: VBEP_TOKEN_DECIMALS,
      } as Token,
      cake: {
        id: 'cake',
        symbol: 'vCAKE',
        address: VBEP_TOKEN_ADDRESSES.cake[97],
        decimals: VBEP_TOKEN_DECIMALS,
      } as Token,
      aave: {
        id: 'aave',
        symbol: 'vAAVE',
        address: VBEP_TOKEN_ADDRESSES.aave[97],
        decimals: VBEP_TOKEN_DECIMALS,
      } as Token,
      tusd: {
        id: 'tusd',
        symbol: 'vTUSD',
        address: VBEP_TOKEN_ADDRESSES.tusd[97],
        decimals: VBEP_TOKEN_DECIMALS,
      } as Token,
      trx: {
        id: 'trx',
        symbol: 'vTRX',
        address: VBEP_TOKEN_ADDRESSES.trx[97],
        decimals: VBEP_TOKEN_DECIMALS,
      } as Token,
      ust: {
        id: 'ust',
        symbol: 'vUST',
        address: VBEP_TOKEN_ADDRESSES.ust[97],
        decimals: VBEP_TOKEN_DECIMALS,
      } as Token,
      luna: {
        id: 'luna',
        symbol: 'vLUNA',
        address: VBEP_TOKEN_ADDRESSES.luna[97],
        decimals: VBEP_TOKEN_DECIMALS,
      } as Token,
    }
  : {
      sxp: {
        id: 'sxp',
        symbol: 'vSXP',
        address: VBEP_TOKEN_ADDRESSES.sxp[56],
        decimals: VBEP_TOKEN_DECIMALS,
      } as Token,
      usdc: {
        id: 'usdc',
        symbol: 'vUSDC',
        address: VBEP_TOKEN_ADDRESSES.usdc[56],
        decimals: VBEP_TOKEN_DECIMALS,
      } as Token,
      usdt: {
        id: 'usdt',
        symbol: 'vUSDT',
        address: VBEP_TOKEN_ADDRESSES.usdt[56],
        decimals: VBEP_TOKEN_DECIMALS,
      } as Token,
      busd: {
        id: 'busd',
        symbol: 'vBUSD',
        address: VBEP_TOKEN_ADDRESSES.busd[56],
        decimals: VBEP_TOKEN_DECIMALS,
      } as Token,
      bnb: {
        id: 'bnb',
        symbol: 'vBNB',
        address: VBEP_TOKEN_ADDRESSES.bnb[56],
        decimals: VBEP_TOKEN_DECIMALS,
      } as Token,
      xvs: {
        id: 'xvs',
        symbol: 'vXVS',
        address: VBEP_TOKEN_ADDRESSES.xvs[56],
        decimals: VBEP_TOKEN_DECIMALS,
      } as Token,
      btcb: {
        id: 'btcb',
        symbol: 'vBTC',
        address: VBEP_TOKEN_ADDRESSES.btcb[56],
        decimals: VBEP_TOKEN_DECIMALS,
      } as Token,
      eth: {
        id: 'eth',
        symbol: 'vETH',
        address: VBEP_TOKEN_ADDRESSES.eth[56],
        decimals: VBEP_TOKEN_DECIMALS,
      } as Token,
      ltc: {
        id: 'ltc',
        symbol: 'vLTC',
        address: VBEP_TOKEN_ADDRESSES.ltc[56],
        decimals: VBEP_TOKEN_DECIMALS,
      } as Token,
      xrp: {
        id: 'xrp',
        symbol: 'vXRP',
        address: VBEP_TOKEN_ADDRESSES.xrp[56],
        decimals: VBEP_TOKEN_DECIMALS,
      } as Token,
      bch: {
        id: 'bch',
        symbol: 'vBCH',
        address: VBEP_TOKEN_ADDRESSES.bch[56],
        decimals: VBEP_TOKEN_DECIMALS,
      } as Token,
      dot: {
        id: 'dot',
        symbol: 'vDOT',
        address: VBEP_TOKEN_ADDRESSES.dot[56],
        decimals: VBEP_TOKEN_DECIMALS,
      } as Token,
      link: {
        id: 'link',
        symbol: 'vLINK',
        address: VBEP_TOKEN_ADDRESSES.link[56],
        decimals: VBEP_TOKEN_DECIMALS,
      } as Token,
      dai: {
        id: 'dai',
        symbol: 'vDAI',
        address: VBEP_TOKEN_ADDRESSES.dai[56],
        decimals: VBEP_TOKEN_DECIMALS,
      } as Token,
      fil: {
        id: 'fil',
        symbol: 'vFIL',
        address: VBEP_TOKEN_ADDRESSES.fil[56],
        decimals: VBEP_TOKEN_DECIMALS,
      } as Token,
      beth: {
        id: 'beth',
        symbol: 'vBETH',
        address: VBEP_TOKEN_ADDRESSES.beth[56],
        decimals: VBEP_TOKEN_DECIMALS,
      } as Token,
      ada: {
        id: 'ada',
        symbol: 'vADA',
        address: VBEP_TOKEN_ADDRESSES.ada[56],
        decimals: VBEP_TOKEN_DECIMALS,
      } as Token,
      doge: {
        id: 'doge',
        symbol: 'vDOGE',
        address: VBEP_TOKEN_ADDRESSES.doge[56],
        decimals: VBEP_TOKEN_DECIMALS,
      } as Token,
      matic: {
        id: 'matic',
        symbol: 'vMATIC',
        address: VBEP_TOKEN_ADDRESSES.matic[56],
        decimals: VBEP_TOKEN_DECIMALS,
      } as Token,
      cake: {
        id: 'cake',
        symbol: 'vCAKE',
        address: VBEP_TOKEN_ADDRESSES.cake[56],
        decimals: VBEP_TOKEN_DECIMALS,
      } as Token,
      aave: {
        id: 'aave',
        symbol: 'vAAVE',
        address: VBEP_TOKEN_ADDRESSES.aave[56],
        decimals: VBEP_TOKEN_DECIMALS,
      } as Token,
      tusd: {
        id: 'tusd',
        symbol: 'vTUSD',
        address: VBEP_TOKEN_ADDRESSES.tusd[56],
        decimals: VBEP_TOKEN_DECIMALS,
      } as Token,
      trx: {
        id: 'trx',
        symbol: 'vTRX',
        address: VBEP_TOKEN_ADDRESSES.trx[56],
        decimals: VBEP_TOKEN_DECIMALS,
      } as Token,
      ust: {
        id: 'ust',
        symbol: 'vUST',
        address: VBEP_TOKEN_ADDRESSES.ust[56],
        decimals: VBEP_TOKEN_DECIMALS,
      } as Token,
      luna: {
        id: 'luna',
        symbol: 'vLUNA',
        address: VBEP_TOKEN_ADDRESSES.luna[56],
        decimals: VBEP_TOKEN_DECIMALS,
      } as Token,
    };
