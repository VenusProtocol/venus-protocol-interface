import type { VhToken } from '@venusprotocol/chains';

import { busd, usdc, usdt, xvs } from './tokens';

// Note: we don't import ChainId because this causes some hoisting issues with tests
const BSC_TESTNET_ID = 97;

export const vhXvs: VhToken = {
  chainId: BSC_TESTNET_ID,
  address: '0x2000000000000000000000000000000000000001',
  decimals: 18,
  symbol: 'vhXVS',
  underlyingToken: xvs,
};

export const vhUsdc: VhToken = {
  chainId: BSC_TESTNET_ID,
  address: '0x2000000000000000000000000000000000000002',
  decimals: 6,
  symbol: 'vhUSDC',
  underlyingToken: usdc,
};

export const vhUsdt: VhToken = {
  chainId: BSC_TESTNET_ID,
  address: '0x2000000000000000000000000000000000000003',
  decimals: 6,
  symbol: 'vhUSDT',
  underlyingToken: usdt,
};

export const vhBusd: VhToken = {
  chainId: BSC_TESTNET_ID,
  address: '0x2000000000000000000000000000000000000004',
  decimals: 18,
  symbol: 'vhBUSD',
  underlyingToken: busd,
};

export const vhTokens = [vhXvs, vhUsdc, vhUsdt, vhBusd];
