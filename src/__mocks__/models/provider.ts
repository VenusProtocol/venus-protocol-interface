import type { Provider } from '@wagmi/core';
import { BigNumber } from 'ethers';

export const blockNumber = 123;
export const balance = BigNumber.from('1000000000000000000');

const getBlockNumber = vi.fn(async () => blockNumber);
const getBalance = vi.fn(async () => balance);

const provider = {
  getBlockNumber,
  getBalance,
} as unknown as Provider;

export default provider;
