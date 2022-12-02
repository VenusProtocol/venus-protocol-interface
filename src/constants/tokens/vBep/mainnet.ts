import { BscChainId, VToken } from 'types';

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
import { MAINNET_TOKENS } from '../common/mainnet';

export const MAINNET_VBEP_TOKENS = {
  sxp: {
    id: 'sxp',
    symbol: 'vSXP',
    address: VBEP_TOKEN_ADDRESSES.sxp[BscChainId.MAINNET],
    decimals: 8,
    asset: vSxp,
    underlyingToken: MAINNET_TOKENS.sxp,
  } as VToken,
  usdc: {
    id: 'usdc',
    symbol: 'vUSDC',
    address: VBEP_TOKEN_ADDRESSES.usdc[BscChainId.MAINNET],
    decimals: 8,
    asset: vUsdc,
    underlyingToken: MAINNET_TOKENS.usdc,
  } as VToken,
  usdt: {
    id: 'usdt',
    symbol: 'vUSDT',
    address: VBEP_TOKEN_ADDRESSES.usdt[BscChainId.MAINNET],
    decimals: 8,
    asset: vUsdt,
    underlyingToken: MAINNET_TOKENS.usdt,
  } as VToken,
  busd: {
    id: 'busd',
    symbol: 'vBUSD',
    address: VBEP_TOKEN_ADDRESSES.busd[BscChainId.MAINNET],
    decimals: 8,
    asset: vBusd,
    underlyingToken: MAINNET_TOKENS.busd,
  } as VToken,
  bnb: {
    id: 'bnb',
    symbol: 'vBNB',
    address: VBEP_TOKEN_ADDRESSES.bnb[BscChainId.MAINNET],
    decimals: 8,
    asset: vBnb,
    underlyingToken: MAINNET_TOKENS.bnb,
  } as VToken,
  xvs: {
    id: 'xvs',
    symbol: 'vXVS',
    address: VBEP_TOKEN_ADDRESSES.xvs[BscChainId.MAINNET],
    decimals: 8,
    asset: vXvs,
    underlyingToken: MAINNET_TOKENS.xvs,
  } as VToken,
  btcb: {
    id: 'btcb',
    symbol: 'vBTCB',
    address: VBEP_TOKEN_ADDRESSES.btcb[BscChainId.MAINNET],
    decimals: 8,
    asset: vBtcb,
    underlyingToken: MAINNET_TOKENS.btcb,
  } as VToken,
  eth: {
    id: 'eth',
    symbol: 'vETH',
    address: VBEP_TOKEN_ADDRESSES.eth[BscChainId.MAINNET],
    decimals: 8,
    asset: vEth,
    underlyingToken: MAINNET_TOKENS.eth,
  } as VToken,
  ltc: {
    id: 'ltc',
    symbol: 'vLTC',
    address: VBEP_TOKEN_ADDRESSES.ltc[BscChainId.MAINNET],
    decimals: 8,
    asset: vLtc,
    underlyingToken: MAINNET_TOKENS.ltc,
  } as VToken,
  xrp: {
    id: 'xrp',
    symbol: 'vXRP',
    address: VBEP_TOKEN_ADDRESSES.xrp[BscChainId.MAINNET],
    decimals: 8,
    asset: vXrp,
    underlyingToken: MAINNET_TOKENS.xrp,
  } as VToken,
  bch: {
    id: 'bch',
    symbol: 'vBCH',
    address: VBEP_TOKEN_ADDRESSES.bch[BscChainId.MAINNET],
    decimals: 8,
    asset: vBch,
    underlyingToken: MAINNET_TOKENS.bch,
  } as VToken,
  dot: {
    id: 'dot',
    symbol: 'vDOT',
    address: VBEP_TOKEN_ADDRESSES.dot[BscChainId.MAINNET],
    decimals: 8,
    asset: vDot,
    underlyingToken: MAINNET_TOKENS.dot,
  } as VToken,
  link: {
    id: 'link',
    symbol: 'vLINK',
    address: VBEP_TOKEN_ADDRESSES.link[BscChainId.MAINNET],
    decimals: 8,
    asset: vLink,
    underlyingToken: MAINNET_TOKENS.link,
  } as VToken,
  dai: {
    id: 'dai',
    symbol: 'vDAI',
    address: VBEP_TOKEN_ADDRESSES.dai[BscChainId.MAINNET],
    decimals: 8,
    asset: vDai,
    underlyingToken: MAINNET_TOKENS.dai,
  } as VToken,
  fil: {
    id: 'fil',
    symbol: 'vFIL',
    address: VBEP_TOKEN_ADDRESSES.fil[BscChainId.MAINNET],
    decimals: 8,
    asset: vFil,
    underlyingToken: MAINNET_TOKENS.fil,
  } as VToken,
  beth: {
    id: 'beth',
    symbol: 'vBETH',
    address: VBEP_TOKEN_ADDRESSES.beth[BscChainId.MAINNET],
    decimals: 8,
    asset: vBeth,
    underlyingToken: MAINNET_TOKENS.beth,
  } as VToken,
  ada: {
    id: 'ada',
    symbol: 'vADA',
    address: VBEP_TOKEN_ADDRESSES.ada[BscChainId.MAINNET],
    decimals: 8,
    asset: vAda,
    underlyingToken: MAINNET_TOKENS.ada,
  } as VToken,
  doge: {
    id: 'doge',
    symbol: 'vDOGE',
    address: VBEP_TOKEN_ADDRESSES.doge[BscChainId.MAINNET],
    decimals: 8,
    asset: vDoge,
    underlyingToken: MAINNET_TOKENS.doge,
  } as VToken,
  matic: {
    id: 'matic',
    symbol: 'vMATIC',
    address: VBEP_TOKEN_ADDRESSES.matic[BscChainId.MAINNET],
    decimals: 8,
    asset: vMatic,
    underlyingToken: MAINNET_TOKENS.matic,
  } as VToken,
  cake: {
    id: 'cake',
    symbol: 'vCAKE',
    address: VBEP_TOKEN_ADDRESSES.cake[BscChainId.MAINNET],
    decimals: 8,
    asset: vCake,
    underlyingToken: MAINNET_TOKENS.cake,
  } as VToken,
  aave: {
    id: 'aave',
    symbol: 'vAAVE',
    address: VBEP_TOKEN_ADDRESSES.aave[BscChainId.MAINNET],
    decimals: 8,
    asset: vAave,
    underlyingToken: MAINNET_TOKENS.aave,
  } as VToken,
  tusd: {
    id: 'tusd',
    symbol: 'vTUSD',
    address: VBEP_TOKEN_ADDRESSES.tusd[BscChainId.MAINNET],
    decimals: 8,
    asset: vTusd,
    underlyingToken: MAINNET_TOKENS.tusd,
  } as VToken,
  trx: {
    id: 'trx',
    symbol: 'vTRX',
    address: VBEP_TOKEN_ADDRESSES.trx[BscChainId.MAINNET],
    decimals: 8,
    asset: vTrx,
    underlyingToken: MAINNET_TOKENS.trx,
  } as VToken,
  ust: {
    id: 'ust',
    symbol: 'vUST',
    address: VBEP_TOKEN_ADDRESSES.ust[BscChainId.MAINNET],
    decimals: 8,
    asset: vUst,
    underlyingToken: MAINNET_TOKENS.ust,
  } as VToken,
  luna: {
    id: 'luna',
    symbol: 'vLUNA',
    address: VBEP_TOKEN_ADDRESSES.luna[BscChainId.MAINNET],
    decimals: 8,
    asset: vLuna,
    underlyingToken: MAINNET_TOKENS.luna,
  } as VToken,
};
