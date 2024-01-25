import { PoolLens, Prime, ResilientOracle } from 'packages/contracts';
import { type Provider } from 'packages/wallet';
import { ChainId, Pool, Token } from 'types';

export interface GetIsolatedPoolsInput {
  chainId: ChainId;
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
