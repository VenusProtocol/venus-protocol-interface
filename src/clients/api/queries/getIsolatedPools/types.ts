import { PoolLens, Prime, ResilientOracle } from 'packages/contracts';
import { type Provider } from 'packages/wallet';
import { Pool, Token } from 'types';

export interface GetIsolatedPoolsInput {
  xvs: Token;
  blocksPerDay: number;
  tokens: Token[];
  provider: Provider;
  poolRegistryContractAddress: string;
  poolLensContract: PoolLens;
  resilientOracleContract: ResilientOracle;
  primeContract?: Prime;
  accountAddress?: string;
}

export interface GetIsolatedPoolsOutput {
  pools: Pool[];
}
