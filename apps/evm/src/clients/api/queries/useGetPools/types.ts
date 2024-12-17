import type BigNumber from 'bignumber.js';
import type {
  LegacyPoolComptroller,
  PoolLens,
  Prime,
  VaiController,
  VenusLens,
} from 'libs/contracts';
import type { Provider } from 'libs/wallet';
import type { ChainId, Pool, Token } from 'types';

export interface MarketParticipantsCounts {
  borrowerCount: number;
  supplierCount: number;
}

export interface PrimeApy {
  borrowApy: BigNumber;
  supplyApy: BigNumber;
}
export interface GetPoolsInput {
  chainId: ChainId;
  tokens: Token[];
  provider: Provider;
  poolLensContract: PoolLens;
  legacyPoolComptrollerContract?: LegacyPoolComptroller;
  venusLensContract?: VenusLens;
  vaiControllerContract?: VaiController;
  accountAddress?: string;
  primeContract?: Prime;
}

export interface GetPoolsOutput {
  pools: Pool[];
}
