import type { Address } from 'viem';

import type { ChainId } from '../../../types';

export interface TokenFile {
  vTokenAddresses: Address[];
  tokenFileName: string;
  chainId: ChainId;
}

export interface LegacyPoolConfig {
  venusLensContractAddress: Address;
  unitrollerContractAddress: Address;
}

export interface IsolatedPoolConfig {
  poolLensContractAddress: Address;
  poolRegistryContractAddress: Address;
}

export type PoolConfig = {
  configs: Array<LegacyPoolConfig | IsolatedPoolConfig>;
  tokenFileName: string;
  chainId: ChainId;
};
