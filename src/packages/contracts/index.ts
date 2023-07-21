import { ChainId, ContractInfo } from './types';

export * from './types';

export const contracts: {
  [name: string]: ContractInfo;
} = {
  test: {
    addresses: {
      [ChainId.BSC_TESTNET]: '',
      [ChainId.BSC_MAINNET]: '',
    },
    abi: [],
  },
};
