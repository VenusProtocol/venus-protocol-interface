import { BigNumber, providers } from 'ethers';
import { type Provider } from 'libs/wallet';

export const blockNumber = 123;
export const balance = BigNumber.from('1000000000000000000');

const baseProvider = new providers.JsonRpcProvider();
const getBlockNumber = vi.fn(async () => blockNumber);
const getBalance = vi.fn(async () => balance);
const waitForTransaction = vi.fn(async () => {});

const provider = {
  ...baseProvider,
  getBlockNumber,
  getBalance,
  waitForTransaction,
} as unknown as Provider;

export default provider;
