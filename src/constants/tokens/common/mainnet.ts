import { BscChainId, Token } from 'types';

import aave from 'assets/img/tokens/aave.svg';
import ada from 'assets/img/tokens/ada.svg';
import bch from 'assets/img/tokens/bch.svg';
import beth from 'assets/img/tokens/beth.svg';
import bnb from 'assets/img/tokens/bnb.svg';
import btcb from 'assets/img/tokens/btcb.svg';
import busd from 'assets/img/tokens/busd.svg';
import cake from 'assets/img/tokens/cake.svg';
import dai from 'assets/img/tokens/dai.svg';
import doge from 'assets/img/tokens/doge.svg';
import dot from 'assets/img/tokens/dot.svg';
import eth from 'assets/img/tokens/eth.svg';
import fil from 'assets/img/tokens/fil.svg';
import link from 'assets/img/tokens/link.svg';
import ltc from 'assets/img/tokens/ltc.svg';
import luna from 'assets/img/tokens/luna.svg';
import matic from 'assets/img/tokens/matic.svg';
import sxp from 'assets/img/tokens/sxp.svg';
import trx from 'assets/img/tokens/trx.svg';
import tusd from 'assets/img/tokens/tusd.svg';
import usdc from 'assets/img/tokens/usdc.svg';
import usdt from 'assets/img/tokens/usdt.svg';
import ust from 'assets/img/tokens/ust.svg';
import vai from 'assets/img/tokens/vai.svg';
import vrt from 'assets/img/tokens/vrt.svg';
import xrp from 'assets/img/tokens/xrp.svg';
import xvs from 'assets/img/tokens/xvs.svg';

import TOKEN_ADDRESSES from '../../contracts/addresses/tokens.json';

export const MAINNET_TOKENS = {
  bnb: {
    id: 'bnb',
    symbol: 'BNB',
    decimals: 18,
    address: '',
    asset: bnb,
    isNative: true,
  } as Token,
  sxp: {
    id: 'sxp',
    symbol: 'SXP',
    decimals: 18,
    address: TOKEN_ADDRESSES.sxp[BscChainId.MAINNET],
    asset: sxp,
  } as Token,
  usdc: {
    id: 'usdc',
    symbol: 'USDC',
    decimals: 18,
    address: TOKEN_ADDRESSES.usdc[BscChainId.MAINNET],
    asset: usdc,
  } as Token,
  usdt: {
    id: 'usdt',
    symbol: 'USDT',
    decimals: 18,
    address: TOKEN_ADDRESSES.usdt[BscChainId.MAINNET],
    asset: usdt,
  } as Token,
  busd: {
    id: 'busd',
    symbol: 'BUSD',
    decimals: 18,
    address: TOKEN_ADDRESSES.busd[BscChainId.MAINNET],
    asset: busd,
  } as Token,
  xvs: {
    id: 'xvs',
    symbol: 'XVS',
    decimals: 18,
    address: TOKEN_ADDRESSES.xvs[BscChainId.MAINNET],
    asset: xvs,
  } as Token,
  btcb: {
    id: 'btcb',
    symbol: 'BTCB',
    decimals: 18,
    address: TOKEN_ADDRESSES.btcb[BscChainId.MAINNET],
    asset: btcb,
  } as Token,
  eth: {
    id: 'eth',
    symbol: 'ETH',
    decimals: 18,
    address: TOKEN_ADDRESSES.eth[BscChainId.MAINNET],
    asset: eth,
  } as Token,
  ltc: {
    id: 'ltc',
    symbol: 'LTC',
    decimals: 18,
    address: TOKEN_ADDRESSES.ltc[BscChainId.MAINNET],
    asset: ltc,
  } as Token,
  xrp: {
    id: 'xrp',
    symbol: 'XRP',
    decimals: 18,
    address: TOKEN_ADDRESSES.xrp[BscChainId.MAINNET],
    asset: xrp,
  } as Token,
  bch: {
    id: 'bch',
    symbol: 'BCH',
    decimals: 18,
    address: TOKEN_ADDRESSES.bch[BscChainId.MAINNET],
    asset: bch,
  } as Token,
  dot: {
    id: 'dot',
    symbol: 'DOT',
    decimals: 18,
    address: TOKEN_ADDRESSES.dot[BscChainId.MAINNET],
    asset: dot,
  } as Token,
  link: {
    id: 'link',
    symbol: 'LINK',
    decimals: 18,
    address: TOKEN_ADDRESSES.link[BscChainId.MAINNET],
    asset: link,
  } as Token,
  dai: {
    id: 'dai',
    symbol: 'DAI',
    decimals: 18,
    address: TOKEN_ADDRESSES.dai[BscChainId.MAINNET],
    asset: dai,
  } as Token,
  fil: {
    id: 'fil',
    symbol: 'FIL',
    decimals: 18,
    address: TOKEN_ADDRESSES.fil[BscChainId.MAINNET],
    asset: fil,
  } as Token,
  beth: {
    id: 'beth',
    symbol: 'BETH',
    decimals: 18,
    address: TOKEN_ADDRESSES.beth[BscChainId.MAINNET],
    asset: beth,
  } as Token,
  ada: {
    id: 'ada',
    symbol: 'ADA',
    decimals: 18,
    address: TOKEN_ADDRESSES.ada[BscChainId.MAINNET],
    asset: ada,
  } as Token,
  doge: {
    id: 'doge',
    symbol: 'DOGE',
    decimals: 8,
    address: TOKEN_ADDRESSES.doge[BscChainId.MAINNET],
    asset: doge,
  } as Token,
  matic: {
    id: 'matic',
    symbol: 'MATIC',
    decimals: 18,
    address: TOKEN_ADDRESSES.matic[BscChainId.MAINNET],
    asset: matic,
  } as Token,
  cake: {
    id: 'cake',
    symbol: 'CAKE',
    decimals: 18,
    address: TOKEN_ADDRESSES.cake[BscChainId.MAINNET],
    asset: cake,
  } as Token,
  aave: {
    id: 'aave',
    symbol: 'AAVE',
    decimals: 18,
    address: TOKEN_ADDRESSES.aave[BscChainId.MAINNET],
    asset: aave,
  } as Token,
  tusd: {
    id: 'tusd',
    symbol: 'TUSD',
    decimals: 18,
    address: TOKEN_ADDRESSES.tusd[BscChainId.MAINNET],
    asset: tusd,
  } as Token,
  trx: {
    id: 'trx',
    symbol: 'TRX',
    decimals: 6,
    address: TOKEN_ADDRESSES.trx[BscChainId.MAINNET],
    asset: trx,
  } as Token,
  trxold: {
    id: 'trxold',
    symbol: 'TRXOLD',
    decimals: 18,
    address: TOKEN_ADDRESSES.trxold[BscChainId.MAINNET],
    asset: trx,
  } as Token,
  vai: {
    id: 'vai',
    symbol: 'VAI',
    decimals: 18,
    address: TOKEN_ADDRESSES.vai[BscChainId.MAINNET],
    asset: vai,
  } as Token,
  vrt: {
    id: 'vrt',
    symbol: 'VRT',
    decimals: 18,
    address: TOKEN_ADDRESSES.vrt[BscChainId.MAINNET],
    asset: vrt,
  } as Token,
  ust: {
    id: 'ust',
    symbol: 'UST',
    decimals: 6,
    address: TOKEN_ADDRESSES.ust[BscChainId.MAINNET],
    asset: ust,
  } as Token,
  luna: {
    id: 'luna',
    symbol: 'LUNA',
    decimals: 6,
    address: TOKEN_ADDRESSES.luna[BscChainId.MAINNET],
    asset: luna,
  } as Token,
};
