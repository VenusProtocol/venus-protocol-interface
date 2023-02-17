import { BscChainId, Token } from 'types';

import vAave from 'assets/img/tokens/vAave.svg';
import vAda from 'assets/img/tokens/vAda.svg';
import vBch from 'assets/img/tokens/vBch.svg';
import vBeth from 'assets/img/tokens/vBeth.svg';
import vBnb from 'assets/img/tokens/vBnb.svg';
import vBtcb from 'assets/img/tokens/vBtcb.svg';
import vBusd from 'assets/img/tokens/vBusd.svg';
import vCake from 'assets/img/tokens/vCake.svg';
import vDai from 'assets/img/tokens/vDai.svg';
import vDoge from 'assets/img/tokens/vDoge.svg';
import vDot from 'assets/img/tokens/vDot.svg';
import vEth from 'assets/img/tokens/vEth.svg';
import vFil from 'assets/img/tokens/vFil.svg';
import vLink from 'assets/img/tokens/vLink.svg';
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

export const MAINNET_VBEP_TOKENS = {
  sxp: {
    id: 'sxp',
    symbol: 'vSXP',
    address: VBEP_TOKEN_ADDRESSES.sxp[BscChainId.MAINNET],
    decimals: 8,
    asset: vSxp,
  } as Token,
  usdc: {
    id: 'usdc',
    symbol: 'vUSDC',
    address: VBEP_TOKEN_ADDRESSES.usdc[BscChainId.MAINNET],
    decimals: 8,
    asset: vUsdc,
  } as Token,
  usdt: {
    id: 'usdt',
    symbol: 'vUSDT',
    address: VBEP_TOKEN_ADDRESSES.usdt[BscChainId.MAINNET],
    decimals: 8,
    asset: vUsdt,
  } as Token,
  busd: {
    id: 'busd',
    symbol: 'vBUSD',
    address: VBEP_TOKEN_ADDRESSES.busd[BscChainId.MAINNET],
    decimals: 8,
    asset: vBusd,
  } as Token,
  bnb: {
    id: 'bnb',
    symbol: 'vBNB',
    address: VBEP_TOKEN_ADDRESSES.bnb[BscChainId.MAINNET],
    decimals: 8,
    asset: vBnb,
  } as Token,
  xvs: {
    id: 'xvs',
    symbol: 'vXVS',
    address: VBEP_TOKEN_ADDRESSES.xvs[BscChainId.MAINNET],
    decimals: 8,
    asset: vXvs,
  } as Token,
  btcb: {
    id: 'btcb',
    symbol: 'vBTCB',
    address: VBEP_TOKEN_ADDRESSES.btcb[BscChainId.MAINNET],
    decimals: 8,
    asset: vBtcb,
  } as Token,
  eth: {
    id: 'eth',
    symbol: 'vETH',
    address: VBEP_TOKEN_ADDRESSES.eth[BscChainId.MAINNET],
    decimals: 8,
    asset: vEth,
  } as Token,
  ltc: {
    id: 'ltc',
    symbol: 'vLTC',
    address: VBEP_TOKEN_ADDRESSES.ltc[BscChainId.MAINNET],
    decimals: 8,
    asset: vLtc,
  } as Token,
  xrp: {
    id: 'xrp',
    symbol: 'vXRP',
    address: VBEP_TOKEN_ADDRESSES.xrp[BscChainId.MAINNET],
    decimals: 8,
    asset: vXrp,
  } as Token,
  bch: {
    id: 'bch',
    symbol: 'vBCH',
    address: VBEP_TOKEN_ADDRESSES.bch[BscChainId.MAINNET],
    decimals: 8,
    asset: vBch,
  } as Token,
  dot: {
    id: 'dot',
    symbol: 'vDOT',
    address: VBEP_TOKEN_ADDRESSES.dot[BscChainId.MAINNET],
    decimals: 8,
    asset: vDot,
  } as Token,
  link: {
    id: 'link',
    symbol: 'vLINK',
    address: VBEP_TOKEN_ADDRESSES.link[BscChainId.MAINNET],
    decimals: 8,
    asset: vLink,
  } as Token,
  dai: {
    id: 'dai',
    symbol: 'vDAI',
    address: VBEP_TOKEN_ADDRESSES.dai[BscChainId.MAINNET],
    decimals: 8,
    asset: vDai,
  } as Token,
  fil: {
    id: 'fil',
    symbol: 'vFIL',
    address: VBEP_TOKEN_ADDRESSES.fil[BscChainId.MAINNET],
    decimals: 8,
    asset: vFil,
  } as Token,
  beth: {
    id: 'beth',
    symbol: 'vBETH',
    address: VBEP_TOKEN_ADDRESSES.beth[BscChainId.MAINNET],
    decimals: 8,
    asset: vBeth,
  } as Token,
  ada: {
    id: 'ada',
    symbol: 'vADA',
    address: VBEP_TOKEN_ADDRESSES.ada[BscChainId.MAINNET],
    decimals: 8,
    asset: vAda,
  } as Token,
  doge: {
    id: 'doge',
    symbol: 'vDOGE',
    address: VBEP_TOKEN_ADDRESSES.doge[BscChainId.MAINNET],
    decimals: 8,
    asset: vDoge,
  } as Token,
  matic: {
    id: 'matic',
    symbol: 'vMATIC',
    address: VBEP_TOKEN_ADDRESSES.matic[BscChainId.MAINNET],
    decimals: 8,
    asset: vMatic,
  } as Token,
  cake: {
    id: 'cake',
    symbol: 'vCAKE',
    address: VBEP_TOKEN_ADDRESSES.cake[BscChainId.MAINNET],
    decimals: 8,
    asset: vCake,
  } as Token,
  aave: {
    id: 'aave',
    symbol: 'vAAVE',
    address: VBEP_TOKEN_ADDRESSES.aave[BscChainId.MAINNET],
    decimals: 8,
    asset: vAave,
  } as Token,
  tusd: {
    id: 'tusd',
    symbol: 'vTUSD',
    address: VBEP_TOKEN_ADDRESSES.tusd[BscChainId.MAINNET],
    decimals: 8,
    asset: vTusd,
  } as Token,
  trx: {
    id: 'trx',
    symbol: 'vTRX',
    address: VBEP_TOKEN_ADDRESSES.trx[BscChainId.MAINNET],
    decimals: 8,
    asset: vTrx,
  } as Token,
  trxold: {
    id: 'trxold',
    symbol: 'vTRXOLD',
    address: VBEP_TOKEN_ADDRESSES.trxold[BscChainId.MAINNET],
    decimals: 8,
    asset: vTrx,
  } as Token,
  ust: {
    id: 'ust',
    symbol: 'vUST',
    address: VBEP_TOKEN_ADDRESSES.ust[BscChainId.MAINNET],
    decimals: 8,
    asset: vUst,
  } as Token,
  luna: {
    id: 'luna',
    symbol: 'vLUNA',
    address: VBEP_TOKEN_ADDRESSES.luna[BscChainId.MAINNET],
    decimals: 8,
    asset: vLuna,
  } as Token,
};
