import BigNumber from 'bignumber.js';

export const PRIME_DOC_URL = 'https://docs-v4.venus.io/whats-new/prime-yield';

export const PRIME_APY_DOC_URL =
  'https://docs-v4.venus.io/technical-reference/reference-technical-articles/prime#calculate-apr-associated-with-a-prime-market-and-user';

// TODO: add other tokens and update to use vToken addresses instead

export const supplyAveragesForToken: Record<string, BigNumber> = {
  BTCB: new BigNumber('0.71'),
  ETH: new BigNumber('9.86'),
  USDT: new BigNumber('5003.94'),
  USDC: new BigNumber('13068.75'),
};

export const borrowAveragesForToken: Record<string, BigNumber> = {
  BTCB: new BigNumber('0.04'),
  ETH: new BigNumber('0.49'),
  USDT: new BigNumber('10009.21'),
  USDC: new BigNumber('2405.43'),
};

export const xvsStakedAveragesForToken: Record<string, BigNumber> = {
  BTCB: new BigNumber('4124.59'),
  ETH: new BigNumber('4788.05'),
  USDT: new BigNumber('3731.33'),
  USDC: new BigNumber('3265.30'),
};
