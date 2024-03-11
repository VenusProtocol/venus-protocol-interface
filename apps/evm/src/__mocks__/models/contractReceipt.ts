import { BigNumber as BN, type ContractReceipt } from 'ethers';

const contractReceipt: ContractReceipt = {
  status: 1,
  contractAddress: 'fake-contract-address',
  transactionHash: 'fake-transaction-hash',
  confirmations: 5,
  type: 1,
  transactionIndex: 0,
  byzantium: false,
  blockHash: 'fake-block-hash',
  blockNumber: 0,
  from: 'fake-from',
  to: 'fake-to',
  cumulativeGasUsed: BN.from(99999),
  effectiveGasPrice: BN.from(99999),
  gasUsed: BN.from(99999),
  logs: [],
  logsBloom: 'fake-logs-bloom',
};

export default contractReceipt;
