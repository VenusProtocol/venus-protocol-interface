import type { JsonFragment } from '@ethersproject/abi';

export interface ContractInfo {
  addresses: {
    [chainId: number]: string;
  };
  abi: JsonFragment[];
}
