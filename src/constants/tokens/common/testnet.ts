import { BscChainId, Token } from 'types';

import aave from 'assets/img/tokens/aave.svg';
import ada from 'assets/img/tokens/ada.svg';
import bnb from 'assets/img/tokens/bnb.svg';
import btcb from 'assets/img/tokens/btcb.svg';
import busd from 'assets/img/tokens/busd.svg';
import cake from 'assets/img/tokens/cake.svg';
import doge from 'assets/img/tokens/doge.svg';
import eth from 'assets/img/tokens/eth.svg';
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

export const TESTNET_TOKENS = {
  bnb: {
    id: 'bnb',
    symbol: 'BNB',
    decimals: 18,
    address: TOKEN_ADDRESSES.bnb[BscChainId.TESTNET],
    asset: bnb,
    isNative: true,
  } as Token,
  sxp: {
    id: 'sxp',
    symbol: 'SXP',
    decimals: 18,
    address: TOKEN_ADDRESSES.sxp[BscChainId.TESTNET],
    asset: sxp,
  } as Token,
  usdc: {
    id: 'usdc',
    symbol: 'USDC',
    decimals: 6,
    address: TOKEN_ADDRESSES.usdc[BscChainId.TESTNET],
    asset: usdc,
  } as Token,
  usdt: {
    id: 'usdt',
    symbol: 'USDT',
    decimals: 6,
    address: TOKEN_ADDRESSES.usdt[BscChainId.TESTNET],
    asset: usdt,
  } as Token,
  busd: {
    id: 'busd',
    symbol: 'BUSD',
    decimals: 18,
    address: TOKEN_ADDRESSES.busd[BscChainId.TESTNET],
    asset: busd,
  } as Token,
  xvs: {
    id: 'xvs',
    symbol: 'XVS',
    decimals: 18,
    address: TOKEN_ADDRESSES.xvs[BscChainId.TESTNET],
    asset: xvs,
  } as Token,
  btcb: {
    id: 'btcb',
    symbol: 'BTCB',
    decimals: 18,
    address: TOKEN_ADDRESSES.btcb[BscChainId.TESTNET],
    asset: btcb,
  } as Token,
  eth: {
    id: 'eth',
    symbol: 'ETH',
    decimals: 18,
    address: TOKEN_ADDRESSES.eth[BscChainId.TESTNET],
    asset: eth,
  } as Token,
  ltc: {
    id: 'ltc',
    symbol: 'LTC',
    decimals: 18,
    address: TOKEN_ADDRESSES.ltc[BscChainId.TESTNET],
    asset: ltc,
  } as Token,
  xrp: {
    id: 'xrp',
    symbol: 'XRP',
    decimals: 18,
    address: TOKEN_ADDRESSES.xrp[BscChainId.TESTNET],
    asset: xrp,
  } as Token,
  ada: {
    id: 'ada',
    symbol: 'ADA',
    decimals: 18,
    address: TOKEN_ADDRESSES.ada[BscChainId.TESTNET],
    asset: ada,
  } as Token,
  doge: {
    id: 'doge',
    symbol: 'DOGE',
    decimals: 8,
    address: TOKEN_ADDRESSES.doge[BscChainId.TESTNET],
    asset: doge,
  } as Token,
  matic: {
    id: 'matic',
    symbol: 'MATIC',
    decimals: 18,
    address: TOKEN_ADDRESSES.matic[BscChainId.TESTNET],
    asset: matic,
  } as Token,
  cake: {
    id: 'cake',
    symbol: 'CAKE',
    decimals: 18,
    address: TOKEN_ADDRESSES.cake[BscChainId.TESTNET],
    asset: cake,
  } as Token,
  aave: {
    id: 'aave',
    symbol: 'AAVE',
    decimals: 18,
    address: TOKEN_ADDRESSES.aave[BscChainId.TESTNET],
    asset: aave,
  } as Token,
  tusd: {
    id: 'tusd',
    symbol: 'TUSD',
    decimals: 18,
    address: TOKEN_ADDRESSES.tusd[BscChainId.TESTNET],
    asset: tusd,
  } as Token,
  trx: {
    id: 'trx',
    symbol: 'TRX',
    decimals: 6,
    address: TOKEN_ADDRESSES.trx[BscChainId.TESTNET],
    asset: trx,
  } as Token,
  trxold: {
    id: 'trxold',
    symbol: 'TRXOLD',
    decimals: 18,
    address: TOKEN_ADDRESSES.trxold[BscChainId.TESTNET],
    asset: trx,
  } as Token,
  ust: {
    id: 'ust',
    symbol: 'UST',
    decimals: 18,
    address: TOKEN_ADDRESSES.ust[BscChainId.TESTNET],
    asset: ust,
  } as Token,
  luna: {
    id: 'luna',
    symbol: 'LUNA',
    decimals: 6,
    address: TOKEN_ADDRESSES.luna[BscChainId.TESTNET],
    asset: luna,
  } as Token,
  vai: {
    id: 'vai',
    symbol: 'VAI',
    decimals: 18,
    address: TOKEN_ADDRESSES.vai[BscChainId.TESTNET],
    asset: vai,
  } as Token,
  vrt: {
    id: 'vrt',
    symbol: 'VRT',
    decimals: 18,
    address: TOKEN_ADDRESSES.vrt[BscChainId.TESTNET],
    asset: vrt,
  } as Token,
};
