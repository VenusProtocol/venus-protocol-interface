import type { JsonFragment } from '@ethersproject/abi';

export enum ChainId {
  'BSC_MAINNET' = 56,
  'BSC_TESTNET' = 97,
}

export interface ContractInfo {
  addresses: {
    [chainId: number]: string;
  };
  abi: JsonFragment[];
}
