import type { PoolLens, Prime, ResilientOracle } from 'libs/contracts';
import type { Provider } from 'libs/wallet';
import type { ChainId, Pool, Token } from 'types';

export interface GetIsolatedPoolsInput {
  chainId: ChainId;
  xvs: Token;
  tokens: Token[];
  provider: Provider;
  poolRegistryContractAddress: string;
  vTreasuryContractAddress: string;
  poolLensContract: PoolLens;
  resilientOracleContract: ResilientOracle;
  blocksPerDay?: number;
  primeContract?: Prime;
  accountAddress?: string;
}

export interface GetIsolatedPoolsOutput {
  pools: Pool[];
}
