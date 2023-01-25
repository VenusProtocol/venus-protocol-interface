import { BigNumber, Signer } from 'ethers';

import fakeAddress from './address';

export const signerAddress = fakeAddress;
export const signerBalance = BigNumber.from('1000000000000000000');

const getAddress = jest.fn(async () => signerAddress);
const getBalance = jest.fn(async () => signerBalance);
const signMessage = jest.fn();
const signTransaction = jest.fn();
const connect = jest.fn();
const getTransactionCount = jest.fn();
const estimateGas = jest.fn();
const call = jest.fn();
const sendTransaction = jest.fn();
const getChainId = jest.fn();
const getGasPrice = jest.fn();
const getFeeData = jest.fn();
const resolveName = jest.fn();
const checkTransaction = jest.fn();
const populateTransaction = jest.fn();
const checkProvider = jest.fn();

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
