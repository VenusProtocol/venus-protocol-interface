import type { PoolLens, Prime } from 'libs/contracts';
import type { Provider } from 'libs/wallet';
import type { ChainId, Pool, Token } from 'types';
import type { GetApiPoolsOutput } from '../getApiPools';

export interface GetIsolatedPoolsInput {
  chainId: ChainId;
  xvs: Token;
  tokens: Token[];
  provider: Provider;
  vTreasuryContractAddress: string;
  poolLensContract: PoolLens;
  blocksPerDay?: number;
  primeContract?: Prime;
  accountAddress?: string;
  isolatedPoolsData: GetApiPoolsOutput;
}

export interface GetIsolatedPoolsOutput {
  pools: Pool[];
}
