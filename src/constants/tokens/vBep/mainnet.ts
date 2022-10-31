import { BscChainId, Token } from 'types';

import VBEP_TOKEN_ADDRESSES from '../../contracts/addresses/vBepTokens.json';

// TODO: add asset prop

export const MAINNET_VBEP_TOKENS = {
  sxp: {
    id: 'sxp',
    symbol: 'vSXP',
    address: VBEP_TOKEN_ADDRESSES.sxp[BscChainId.MAINNET],
    decimals: 8,
  } as Token,
  usdc: {
    id: 'usdc',
    symbol: 'vUSDC',
    address: VBEP_TOKEN_ADDRESSES.usdc[BscChainId.MAINNET],
    decimals: 8,
  } as Token,
  usdt: {
    id: 'usdt',
    symbol: 'vUSDT',
    address: VBEP_TOKEN_ADDRESSES.usdt[BscChainId.MAINNET],
    decimals: 8,
  } as Token,
  busd: {
    id: 'busd',
    symbol: 'vBUSD',
    address: VBEP_TOKEN_ADDRESSES.busd[BscChainId.MAINNET],
    decimals: 8,
  } as Token,
  bnb: {
    id: 'bnb',
    symbol: 'vBNB',
    address: VBEP_TOKEN_ADDRESSES.bnb[BscChainId.MAINNET],
    decimals: 8,
  } as Token,
  xvs: {
    id: 'xvs',
    symbol: 'vXVS',
    address: VBEP_TOKEN_ADDRESSES.xvs[BscChainId.MAINNET],
    decimals: 8,
  } as Token,
  btcb: {
    id: 'btcb',
    symbol: 'vBTC',
    address: VBEP_TOKEN_ADDRESSES.btcb[BscChainId.MAINNET],
    decimals: 8,
  } as Token,
  eth: {
    id: 'eth',
    symbol: 'vETH',
    address: VBEP_TOKEN_ADDRESSES.eth[BscChainId.MAINNET],
    decimals: 8,
  } as Token,
  ltc: {
    id: 'ltc',
    symbol: 'vLTC',
    address: VBEP_TOKEN_ADDRESSES.ltc[BscChainId.MAINNET],
    decimals: 8,
  } as Token,
  xrp: {
    id: 'xrp',
    symbol: 'vXRP',
    address: VBEP_TOKEN_ADDRESSES.xrp[BscChainId.MAINNET],
    decimals: 8,
  } as Token,
  bch: {
    id: 'bch',
    symbol: 'vBCH',
    address: VBEP_TOKEN_ADDRESSES.bch[BscChainId.MAINNET],
    decimals: 8,
  } as Token,
  dot: {
    id: 'dot',
    symbol: 'vDOT',
    address: VBEP_TOKEN_ADDRESSES.dot[BscChainId.MAINNET],
    decimals: 8,
  } as Token,
  link: {
    id: 'link',
    symbol: 'vLINK',
    address: VBEP_TOKEN_ADDRESSES.link[BscChainId.MAINNET],
    decimals: 8,
  } as Token,
  dai: {
    id: 'dai',
    symbol: 'vDAI',
    address: VBEP_TOKEN_ADDRESSES.dai[BscChainId.MAINNET],
    decimals: 8,
  } as Token,
  fil: {
    id: 'fil',
    symbol: 'vFIL',
    address: VBEP_TOKEN_ADDRESSES.fil[BscChainId.MAINNET],
    decimals: 8,
  } as Token,
  beth: {
    id: 'beth',
    symbol: 'vBETH',
    address: VBEP_TOKEN_ADDRESSES.beth[BscChainId.MAINNET],
    decimals: 8,
  } as Token,
  ada: {
    id: 'ada',
    symbol: 'vADA',
    address: VBEP_TOKEN_ADDRESSES.ada[BscChainId.MAINNET],
    decimals: 8,
  } as Token,
  doge: {
    id: 'doge',
    symbol: 'vDOGE',
    address: VBEP_TOKEN_ADDRESSES.doge[BscChainId.MAINNET],
    decimals: 8,
  } as Token,
  matic: {
    id: 'matic',
    symbol: 'vMATIC',
    address: VBEP_TOKEN_ADDRESSES.matic[BscChainId.MAINNET],
    decimals: 8,
  } as Token,
  cake: {
    id: 'cake',
    symbol: 'vCAKE',
    address: VBEP_TOKEN_ADDRESSES.cake[BscChainId.MAINNET],
    decimals: 8,
  } as Token,
  aave: {
    id: 'aave',
    symbol: 'vAAVE',
    address: VBEP_TOKEN_ADDRESSES.aave[BscChainId.MAINNET],
    decimals: 8,
  } as Token,
  tusd: {
    id: 'tusd',
    symbol: 'vTUSD',
    address: VBEP_TOKEN_ADDRESSES.tusd[BscChainId.MAINNET],
    decimals: 8,
  } as Token,
  trx: {
    id: 'trx',
    symbol: 'vTRX',
    address: VBEP_TOKEN_ADDRESSES.trx[BscChainId.MAINNET],
    decimals: 8,
  } as Token,
  ust: {
    id: 'ust',
    symbol: 'vUST',
    address: VBEP_TOKEN_ADDRESSES.ust[BscChainId.MAINNET],
    decimals: 8,
  } as Token,
  luna: {
    id: 'luna',
    symbol: 'vLUNA',
    address: VBEP_TOKEN_ADDRESSES.luna[BscChainId.MAINNET],
    decimals: 8,
  } as Token,
};
