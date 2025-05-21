import { ChainId } from 'types';
import type { Transaction } from 'viem';

const contractTransaction: Transaction = {
  hash: '0xfake-transaction-hash',
  type: 'legacy',
  from: '0x1d759121234cd36F8124C21aFe1c6852d2bEd848',
  to: '0x2d759121234cd36F8124C21aFe1c6852d2bEd834',
  nonce: 10,
  value: 0n,
  chainId: ChainId.BSC_TESTNET,
  blockHash: '0xfake-block-hash',
  blockNumber: 1123213n,
  gas: 12n,
  gasPrice: 1n,
  input: '0xfake-input',
  r: '0xfake-r',
  s: '0xfake-s',
  v: 3n,
  transactionIndex: 1,
  typeHex: '0xfake-type-hex',
};

export default contractTransaction;
