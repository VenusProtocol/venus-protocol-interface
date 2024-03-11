import { BigNumber as BN, type ContractTransaction } from 'ethers';

import { ChainId } from 'types';

const contractTransaction: ContractTransaction = {
  hash: 'fake-transaction-hash',
  type: 1,
  wait: vi.fn(),
  confirmations: 0,
  from: '0x1d759121234cd36F8124C21aFe1c6852d2bEd848',
  to: '0x2d759121234cd36F8124C21aFe1c6852d2bEd834',
  nonce: 10,
  gasLimit: BN.from('100000000000'),
  data: 'Fake data',
  value: BN.from('0'),
  chainId: ChainId.BSC_TESTNET,
};

export default contractTransaction;
