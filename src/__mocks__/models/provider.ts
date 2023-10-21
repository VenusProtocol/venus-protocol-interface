import { BigNumber } from 'ethers';

import { type Provider } from 'clients/web3';

export const blockNumber = 123;
export const balance = BigNumber.from('1000000000000000000');

const getBlockNumber = vi.fn(async () => blockNumber);
const getBalance = vi.fn(async () => balance);
const waitForTransaction = vi.fn(async () => {});

const provider = {
  getBlockNumber,
  getBalance,
  waitForTransaction,
} as unknown as Provider;

export default provider;
