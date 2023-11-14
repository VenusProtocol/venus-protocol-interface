import { PoolLens, ResilientOracle } from 'packages/contracts';
import { Pool, Token } from 'types';

import { type Provider } from 'clients/web3';

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
