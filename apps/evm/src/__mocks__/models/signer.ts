import { BigNumber, type Signer } from 'ethers';

import fakeAddress from './address';

export const signerAddress = fakeAddress;
export const signerBalance = BigNumber.from('1000000000000000000');

const getAddress = vi.fn(async () => signerAddress);
const getBalance = vi.fn(async () => signerBalance);
const signMessage = vi.fn();
const signTransaction = vi.fn();
const connect = vi.fn();
const getTransactionCount = vi.fn();
const estimateGas = vi.fn();
const call = vi.fn();
const sendTransaction = vi.fn();
const getChainId = vi.fn();
const getGasPrice = vi.fn();
const getFeeData = vi.fn();
const resolveName = vi.fn();
const checkTransaction = vi.fn();
const populateTransaction = vi.fn();
const checkProvider = vi.fn();

const signer: Signer = {
  getAddress,
  getBalance,
  signMessage,
  signTransaction,
  connect,
  getTransactionCount,
  estimateGas,
  call,
  sendTransaction,
  getChainId,
  getGasPrice,
  getFeeData,
  resolveName,
  checkTransaction,
  populateTransaction,
  _checkProvider: checkProvider,
  _isSigner: true,
};

export default signer;
