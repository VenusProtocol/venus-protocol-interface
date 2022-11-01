import { BscChainId, Token } from 'types';

import vAave from 'assets/tokens/vAave.svg';
import vAda from 'assets/tokens/vAda.svg';
import vBnb from 'assets/tokens/vBnb.svg';
import vBtc from 'assets/tokens/vBtc.svg';
import vBusd from 'assets/tokens/vBusd.svg';
import vCake from 'assets/tokens/vCake.svg';
import vDoge from 'assets/tokens/vDoge.svg';
import vEth from 'assets/tokens/vEth.svg';
import vLtc from 'assets/tokens/vLtc.svg';
import vLuna from 'assets/tokens/vLuna.svg';
import vMatic from 'assets/tokens/vMatic.svg';
import vSxp from 'assets/tokens/vSxp.svg';
import vTrx from 'assets/tokens/vTrx.svg';
import vTusd from 'assets/tokens/vTusd.svg';
import vUsdc from 'assets/tokens/vUsdc.svg';
import vUsdt from 'assets/tokens/vUsdt.svg';
import vUst from 'assets/tokens/vUst.svg';
import vXrp from 'assets/tokens/vXrp.svg';
import vXvs from 'assets/tokens/vXvs.svg';

import VBEP_TOKEN_ADDRESSES from '../../contracts/addresses/vBepTokens.json';

export const TESTNET_VBEP_TOKENS = {
  sxp: {
    id: 'sxp',
    symbol: 'vSxp',
    address: VBEP_TOKEN_ADDRESSES.sxp[BscChainId.TESTNET],
    decimals: 8,
    asset: vSxp,
  } as Token,
  usdc: {
    id: 'usdc',
    symbol: 'vUsdc',
    address: VBEP_TOKEN_ADDRESSES.usdc[BscChainId.TESTNET],
    decimals: 8,
    asset: vUsdc,
  } as Token,
  usdt: {
    id: 'usdt',
    symbol: 'vUsdt',
    address: VBEP_TOKEN_ADDRESSES.usdt[BscChainId.TESTNET],
    decimals: 8,
    asset: vUsdt,
  } as Token,
  busd: {
    id: 'busd',
    symbol: 'vBusd',
    address: VBEP_TOKEN_ADDRESSES.busd[BscChainId.TESTNET],
    decimals: 8,
    asset: vBusd,
  } as Token,
  bnb: {
    id: 'bnb',
    symbol: 'vBnb',
    address: VBEP_TOKEN_ADDRESSES.bnb[BscChainId.TESTNET],
    decimals: 8,
    asset: vBnb,
  } as Token,
  xvs: {
    id: 'xvs',
    symbol: 'vXvs',
    address: VBEP_TOKEN_ADDRESSES.xvs[BscChainId.TESTNET],
    decimals: 8,
    asset: vXvs,
  } as Token,
  btcb: {
    id: 'btcb',
    symbol: 'vBtc',
    address: VBEP_TOKEN_ADDRESSES.btcb[BscChainId.TESTNET],
    decimals: 8,
    asset: vBtc,
  } as Token,
  eth: {
    id: 'eth',
    symbol: 'vEth',
    address: VBEP_TOKEN_ADDRESSES.eth[BscChainId.TESTNET],
    decimals: 8,
    asset: vEth,
  } as Token,
  ltc: {
    id: 'ltc',
    symbol: 'vLtc',
    address: VBEP_TOKEN_ADDRESSES.ltc[BscChainId.TESTNET],
    decimals: 8,
    asset: vLtc,
  } as Token,
  xrp: {
    id: 'xrp',
    symbol: 'vXrp',
    address: VBEP_TOKEN_ADDRESSES.xrp[BscChainId.TESTNET],
    decimals: 8,
    asset: vXrp,
  } as Token,
  ada: {
    id: 'ada',
    symbol: 'vAda',
    address: VBEP_TOKEN_ADDRESSES.ada[BscChainId.TESTNET],
    decimals: 8,
    asset: vAda,
  } as Token,
  doge: {
    id: 'doge',
    symbol: 'vDoge',
    address: VBEP_TOKEN_ADDRESSES.doge[BscChainId.TESTNET],
    decimals: 8,
    asset: vDoge,
  } as Token,
  matic: {
    id: 'matic',
    symbol: 'vMatic',
    address: VBEP_TOKEN_ADDRESSES.matic[BscChainId.TESTNET],
    decimals: 8,
    asset: vMatic,
  } as Token,
  cake: {
    id: 'cake',
    symbol: 'vCake',
    address: VBEP_TOKEN_ADDRESSES.cake[BscChainId.TESTNET],
    decimals: 8,
    asset: vCake,
  } as Token,
  aave: {
    id: 'aave',
    symbol: 'vAave',
    address: VBEP_TOKEN_ADDRESSES.aave[BscChainId.TESTNET],
    decimals: 8,
    asset: vAave,
  } as Token,
  tusd: {
    id: 'tusd',
    symbol: 'vTusd',
    address: VBEP_TOKEN_ADDRESSES.tusd[BscChainId.TESTNET],
    decimals: 8,
    asset: vTusd,
  } as Token,
  trx: {
    id: 'trx',
    symbol: 'vTrx',
    address: VBEP_TOKEN_ADDRESSES.trx[BscChainId.TESTNET],
    decimals: 8,
    asset: vTrx,
  } as Token,
  ust: {
    id: 'ust',
    symbol: 'vUst',
    address: VBEP_TOKEN_ADDRESSES.ust[BscChainId.TESTNET],
    decimals: 8,
    asset: vUst,
  } as Token,
  luna: {
    id: 'luna',
    symbol: 'vLuna',
    address: VBEP_TOKEN_ADDRESSES.luna[BscChainId.TESTNET],
    decimals: 8,
    asset: vLuna,
  } as Token,
};
