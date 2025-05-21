import type { TransactionReceipt, TransactionType } from 'viem';

export const transactionReceipt: TransactionReceipt = {
  status: 'success',
  contractAddress: '0x1234567890123456789012345678901234567890',
  transactionHash: '0x1234567890123456789012345678901234567890123456789012345678901234',
  type: '0x0' as TransactionType,
  transactionIndex: 0,
  blockHash: '0x1234567890123456789012345678901234567890123456789012345678901234',
  blockNumber: 0n,
  from: '0x1234567890123456789012345678901234567890',
  to: '0x1234567890123456789012345678901234567890',
  cumulativeGasUsed: 99999n,
  effectiveGasPrice: 99999n,
  gasUsed: 99999n,
  logs: [],
  logsBloom: '0x0',
};
