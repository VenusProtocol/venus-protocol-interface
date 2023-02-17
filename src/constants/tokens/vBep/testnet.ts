import { BscChainId, Token } from 'types';

import vAave from 'assets/img/tokens/vAave.svg';
import vAda from 'assets/img/tokens/vAda.svg';
import vBnb from 'assets/img/tokens/vBnb.svg';
import vBtcb from 'assets/img/tokens/vBtcb.svg';
import vBusd from 'assets/img/tokens/vBusd.svg';
import vCake from 'assets/img/tokens/vCake.svg';
import vDoge from 'assets/img/tokens/vDoge.svg';
import vEth from 'assets/img/tokens/vEth.svg';
import vLtc from 'assets/img/tokens/vLtc.svg';
import vLuna from 'assets/img/tokens/vLuna.svg';
import vMatic from 'assets/img/tokens/vMatic.svg';
import vSxp from 'assets/img/tokens/vSxp.svg';
import vTrx from 'assets/img/tokens/vTrx.svg';
import vTusd from 'assets/img/tokens/vTusd.svg';
import vUsdc from 'assets/img/tokens/vUsdc.svg';
import vUsdt from 'assets/img/tokens/vUsdt.svg';
import vUst from 'assets/img/tokens/vUst.svg';
import vXrp from 'assets/img/tokens/vXrp.svg';
import vXvs from 'assets/img/tokens/vXvs.svg';

import VBEP_TOKEN_ADDRESSES from '../../contracts/addresses/vBepTokens.json';

export const TESTNET_VBEP_TOKENS = {
  sxp: {
    id: 'sxp',
    symbol: 'vSXP',
    address: VBEP_TOKEN_ADDRESSES.sxp[BscChainId.TESTNET],
    decimals: 8,
    asset: vSxp,
  } as Token,
  usdc: {
    id: 'usdc',
    symbol: 'vUSDC',
    address: VBEP_TOKEN_ADDRESSES.usdc[BscChainId.TESTNET],
    decimals: 8,
    asset: vUsdc,
  } as Token,
  usdt: {
    id: 'usdt',
    symbol: 'vUSDT',
    address: VBEP_TOKEN_ADDRESSES.usdt[BscChainId.TESTNET],
    decimals: 8,
    asset: vUsdt,
  } as Token,
  busd: {
    id: 'busd',
    symbol: 'vBUSD',
    address: VBEP_TOKEN_ADDRESSES.busd[BscChainId.TESTNET],
    decimals: 8,
    asset: vBusd,
  } as Token,
  bnb: {
    id: 'bnb',
    symbol: 'vBNB',
    address: VBEP_TOKEN_ADDRESSES.bnb[BscChainId.TESTNET],
    decimals: 8,
    asset: vBnb,
  } as Token,
  xvs: {
    id: 'xvs',
    symbol: 'vXVS',
    address: VBEP_TOKEN_ADDRESSES.xvs[BscChainId.TESTNET],
    decimals: 8,
    asset: vXvs,
  } as Token,
  btcb: {
    id: 'btcb',
    symbol: 'vBTCB',
    address: VBEP_TOKEN_ADDRESSES.btcb[BscChainId.TESTNET],
    decimals: 8,
    asset: vBtcb,
  } as Token,
  eth: {
    id: 'eth',
    symbol: 'vETH',
    address: VBEP_TOKEN_ADDRESSES.eth[BscChainId.TESTNET],
    decimals: 8,
    asset: vEth,
  } as Token,
  ltc: {
    id: 'ltc',
    symbol: 'vLTC',
    address: VBEP_TOKEN_ADDRESSES.ltc[BscChainId.TESTNET],
    decimals: 8,
    asset: vLtc,
  } as Token,
  xrp: {
    id: 'xrp',
    symbol: 'vXRP',
    address: VBEP_TOKEN_ADDRESSES.xrp[BscChainId.TESTNET],
    decimals: 8,
    asset: vXrp,
  } as Token,
  ada: {
    id: 'ada',
    symbol: 'vADA',
    address: VBEP_TOKEN_ADDRESSES.ada[BscChainId.TESTNET],
    decimals: 8,
    asset: vAda,
  } as Token,
  doge: {
    id: 'doge',
    symbol: 'vDOGE',
    address: VBEP_TOKEN_ADDRESSES.doge[BscChainId.TESTNET],
    decimals: 8,
    asset: vDoge,
  } as Token,
  matic: {
    id: 'matic',
    symbol: 'vMATIC',
    address: VBEP_TOKEN_ADDRESSES.matic[BscChainId.TESTNET],
    decimals: 8,
    asset: vMatic,
  } as Token,
  cake: {
    id: 'cake',
    symbol: 'vCAKE',
    address: VBEP_TOKEN_ADDRESSES.cake[BscChainId.TESTNET],
    decimals: 8,
    asset: vCake,
  } as Token,
  aave: {
    id: 'aave',
    symbol: 'vAAVE',
    address: VBEP_TOKEN_ADDRESSES.aave[BscChainId.TESTNET],
    decimals: 8,
    asset: vAave,
  } as Token,
  tusd: {
    id: 'tusd',
    symbol: 'vTUSD',
    address: VBEP_TOKEN_ADDRESSES.tusd[BscChainId.TESTNET],
    decimals: 8,
    asset: vTusd,
  } as Token,
  trx: {
    id: 'trx',
    symbol: 'vTRX',
    address: VBEP_TOKEN_ADDRESSES.trx[BscChainId.TESTNET],
    decimals: 8,
    asset: vTrx,
  } as Token,
  trxold: {
    id: 'trxold',
    symbol: 'vTRXOLD',
    address: VBEP_TOKEN_ADDRESSES.trxold[BscChainId.TESTNET],
    decimals: 8,
    asset: vTrx,
  } as Token,
  ust: {
    id: 'ust',
    symbol: 'vUST',
    address: VBEP_TOKEN_ADDRESSES.ust[BscChainId.TESTNET],
    decimals: 8,
    asset: vUst,
  } as Token,
  luna: {
    id: 'luna',
    symbol: 'vLUNA',
    address: VBEP_TOKEN_ADDRESSES.luna[BscChainId.TESTNET],
    decimals: 8,
    asset: vLuna,
  } as Token,
};
