import { BscChainId, Token } from 'types';

import VBEP_TOKEN_ADDRESSES from '../../contracts/addresses/vBepTokens.json';

// TODO: add asset prop

export const TESTNET_VBEP_TOKENS = {
  sxp: {
    id: 'sxp',
    symbol: 'vSXP',
    address: VBEP_TOKEN_ADDRESSES.sxp[BscChainId.TESTNET],
    decimals: 8,
  } as Token,
  usdc: {
    id: 'usdc',
    symbol: 'vUSDC',
    address: VBEP_TOKEN_ADDRESSES.usdc[BscChainId.TESTNET],
    decimals: 8,
  } as Token,
  usdt: {
    id: 'usdt',
    symbol: 'vUSDT',
    address: VBEP_TOKEN_ADDRESSES.usdt[BscChainId.TESTNET],
    decimals: 8,
  } as Token,
  busd: {
    id: 'busd',
    symbol: 'vBUSD',
    address: VBEP_TOKEN_ADDRESSES.busd[BscChainId.TESTNET],
    decimals: 8,
  } as Token,
  bnb: {
    id: 'bnb',
    symbol: 'vBNB',
    address: VBEP_TOKEN_ADDRESSES.bnb[BscChainId.TESTNET],
    decimals: 8,
  } as Token,
  xvs: {
    id: 'xvs',
    symbol: 'vXVS',
    address: VBEP_TOKEN_ADDRESSES.xvs[BscChainId.TESTNET],
    decimals: 8,
  } as Token,
  btcb: {
    id: 'btcb',
    symbol: 'vBTC',
    address: VBEP_TOKEN_ADDRESSES.btcb[BscChainId.TESTNET],
    decimals: 8,
  } as Token,
  eth: {
    id: 'eth',
    symbol: 'vETH',
    address: VBEP_TOKEN_ADDRESSES.eth[BscChainId.TESTNET],
    decimals: 8,
  } as Token,
  ltc: {
    id: 'ltc',
    symbol: 'vLTC',
    address: VBEP_TOKEN_ADDRESSES.ltc[BscChainId.TESTNET],
    decimals: 8,
  } as Token,
  xrp: {
    id: 'xrp',
    symbol: 'vXRP',
    address: VBEP_TOKEN_ADDRESSES.xrp[BscChainId.TESTNET],
    decimals: 8,
  } as Token,
  ada: {
    id: 'ada',
    symbol: 'vADA',
    address: VBEP_TOKEN_ADDRESSES.ada[BscChainId.TESTNET],
    decimals: 8,
  } as Token,
  doge: {
    id: 'doge',
    symbol: 'vDOGE',
    address: VBEP_TOKEN_ADDRESSES.doge[BscChainId.TESTNET],
    decimals: 8,
  } as Token,
  matic: {
    id: 'matic',
    symbol: 'vMATIC',
    address: VBEP_TOKEN_ADDRESSES.matic[BscChainId.TESTNET],
    decimals: 8,
  } as Token,
  cake: {
    id: 'cake',
    symbol: 'vCAKE',
    address: VBEP_TOKEN_ADDRESSES.cake[BscChainId.TESTNET],
    decimals: 8,
  } as Token,
  aave: {
    id: 'aave',
    symbol: 'vAAVE',
    address: VBEP_TOKEN_ADDRESSES.aave[BscChainId.TESTNET],
    decimals: 8,
  } as Token,
  tusd: {
    id: 'tusd',
    symbol: 'vTUSD',
    address: VBEP_TOKEN_ADDRESSES.tusd[BscChainId.TESTNET],
    decimals: 8,
  } as Token,
  trx: {
    id: 'trx',
    symbol: 'vTRX',
    address: VBEP_TOKEN_ADDRESSES.trx[BscChainId.TESTNET],
    decimals: 8,
  } as Token,
  ust: {
    id: 'ust',
    symbol: 'vUST',
    address: VBEP_TOKEN_ADDRESSES.ust[BscChainId.TESTNET],
    decimals: 8,
  } as Token,
  luna: {
    id: 'luna',
    symbol: 'vLUNA',
    address: VBEP_TOKEN_ADDRESSES.luna[BscChainId.TESTNET],
    decimals: 8,
  } as Token,
};
