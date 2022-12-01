import { BscChainId, VToken } from 'types';

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
import { TESTNET_TOKENS } from '../common/testnet';

export const TESTNET_VBEP_TOKENS = {
  sxp: {
    id: 'sxp',
    symbol: 'vSXP',
    address: VBEP_TOKEN_ADDRESSES.sxp[BscChainId.TESTNET],
    decimals: 8,
    asset: vSxp,
    underlyingToken: TESTNET_TOKENS.sxp,
  } as VToken,
  usdc: {
    id: 'usdc',
    symbol: 'vUSDC',
    address: VBEP_TOKEN_ADDRESSES.usdc[BscChainId.TESTNET],
    decimals: 8,
    asset: vUsdc,
    underlyingToken: TESTNET_TOKENS.usdc,
  } as VToken,
  usdt: {
    id: 'usdt',
    symbol: 'vUSDT',
    address: VBEP_TOKEN_ADDRESSES.usdt[BscChainId.TESTNET],
    decimals: 8,
    asset: vUsdt,
    underlyingToken: TESTNET_TOKENS.usdt,
  } as VToken,
  busd: {
    id: 'busd',
    symbol: 'vBUSD',
    address: VBEP_TOKEN_ADDRESSES.busd[BscChainId.TESTNET],
    decimals: 8,
    asset: vBusd,
    underlyingToken: TESTNET_TOKENS.busd,
  } as VToken,
  bnb: {
    id: 'bnb',
    symbol: 'vBNB',
    address: VBEP_TOKEN_ADDRESSES.bnb[BscChainId.TESTNET],
    decimals: 8,
    asset: vBnb,
    underlyingToken: TESTNET_TOKENS.bnb,
  } as VToken,
  xvs: {
    id: 'xvs',
    symbol: 'vXVS',
    address: VBEP_TOKEN_ADDRESSES.xvs[BscChainId.TESTNET],
    decimals: 8,
    asset: vXvs,
    underlyingToken: TESTNET_TOKENS.xvs,
  } as VToken,
  btcb: {
    id: 'btcb',
    symbol: 'vBTCB',
    address: VBEP_TOKEN_ADDRESSES.btcb[BscChainId.TESTNET],
    decimals: 8,
    asset: vBtcb,
    underlyingToken: TESTNET_TOKENS.btcb,
  } as VToken,
  eth: {
    id: 'eth',
    symbol: 'vETH',
    address: VBEP_TOKEN_ADDRESSES.eth[BscChainId.TESTNET],
    decimals: 8,
    asset: vEth,
    underlyingToken: TESTNET_TOKENS.eth,
  } as VToken,
  ltc: {
    id: 'ltc',
    symbol: 'vLTC',
    address: VBEP_TOKEN_ADDRESSES.ltc[BscChainId.TESTNET],
    decimals: 8,
    asset: vLtc,
    underlyingToken: TESTNET_TOKENS.ltc,
  } as VToken,
  xrp: {
    id: 'xrp',
    symbol: 'vXRP',
    address: VBEP_TOKEN_ADDRESSES.xrp[BscChainId.TESTNET],
    decimals: 8,
    asset: vXrp,
    underlyingToken: TESTNET_TOKENS.xrp,
  } as VToken,
  ada: {
    id: 'ada',
    symbol: 'vADA',
    address: VBEP_TOKEN_ADDRESSES.ada[BscChainId.TESTNET],
    decimals: 8,
    asset: vAda,
    underlyingToken: TESTNET_TOKENS.ada,
  } as VToken,
  doge: {
    id: 'doge',
    symbol: 'vDOGE',
    address: VBEP_TOKEN_ADDRESSES.doge[BscChainId.TESTNET],
    decimals: 8,
    asset: vDoge,
    underlyingToken: TESTNET_TOKENS.doge,
  } as VToken,
  matic: {
    id: 'matic',
    symbol: 'vMATIC',
    address: VBEP_TOKEN_ADDRESSES.matic[BscChainId.TESTNET],
    decimals: 8,
    asset: vMatic,
    underlyingToken: TESTNET_TOKENS.matic,
  } as VToken,
  cake: {
    id: 'cake',
    symbol: 'vCAKE',
    address: VBEP_TOKEN_ADDRESSES.cake[BscChainId.TESTNET],
    decimals: 8,
    asset: vCake,
    underlyingToken: TESTNET_TOKENS.cake,
  } as VToken,
  aave: {
    id: 'aave',
    symbol: 'vAAVE',
    address: VBEP_TOKEN_ADDRESSES.aave[BscChainId.TESTNET],
    decimals: 8,
    asset: vAave,
    underlyingToken: TESTNET_TOKENS.aave,
  } as VToken,
  tusd: {
    id: 'tusd',
    symbol: 'vTUSD',
    address: VBEP_TOKEN_ADDRESSES.tusd[BscChainId.TESTNET],
    decimals: 8,
    asset: vTusd,
    underlyingToken: TESTNET_TOKENS.tusd,
  } as VToken,
  trx: {
    id: 'trx',
    symbol: 'vTRX',
    address: VBEP_TOKEN_ADDRESSES.trx[BscChainId.TESTNET],
    decimals: 8,
    asset: vTrx,
    underlyingToken: TESTNET_TOKENS.trx,
  } as VToken,
  ust: {
    id: 'ust',
    symbol: 'vUST',
    address: VBEP_TOKEN_ADDRESSES.ust[BscChainId.TESTNET],
    decimals: 8,
    asset: vUst,
    underlyingToken: TESTNET_TOKENS.ust,
  } as VToken,
  luna: {
    id: 'luna',
    symbol: 'vLUNA',
    address: VBEP_TOKEN_ADDRESSES.luna[BscChainId.TESTNET],
    decimals: 8,
    asset: vLuna,
    underlyingToken: TESTNET_TOKENS.luna,
  } as VToken,
};
