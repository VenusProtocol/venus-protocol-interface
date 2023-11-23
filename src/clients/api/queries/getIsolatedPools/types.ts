import { PoolLens, ResilientOracle } from 'packages/contracts';
import { type Provider } from 'packages/wallet';
import { Pool, Token } from 'types';

export interface GetIsolatedPoolsInput {
  blocksPerDay: number;
  tokens: Token[];
  provider: Provider;
  poolRegistryContractAddress: string;
  poolLensContract: PoolLens;
  resilientOracleContract: ResilientOracle;
  accountAddress?: string;
}

export interface GetIsolatedPoolsOutput {
  pools: Pool[];
}
