import type { TransactionReceipt } from 'web3-core/types';

const transactionReceipt: TransactionReceipt = {
  status: true,
  transactionHash: 'fake-transaction-hash',
  transactionIndex: 0,
  blockHash: 'fake-block-hash',
  blockNumber: 0,
  from: 'fake-from',
  to: 'fake-to',
  cumulativeGasUsed: 99999,
  effectiveGasPrice: 99999,
  gasUsed: 99999,
  logs: [],
  logsBloom: 'fake-logs-bloom',
};

export default transactionReceipt;
