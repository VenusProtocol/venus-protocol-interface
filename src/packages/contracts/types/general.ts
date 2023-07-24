import type { JsonFragment } from '@ethersproject/abi';

export enum ChainId {
  'BSC_MAINNET' = 56,
  'BSC_TESTNET' = 97,
}

export interface GenericContractInfo {
  abi: JsonFragment[];
}

export interface FixedAddressContractInfo {
  abi: JsonFragment[];
  address: {
    [chainId in ChainId]: string;
  };
}
