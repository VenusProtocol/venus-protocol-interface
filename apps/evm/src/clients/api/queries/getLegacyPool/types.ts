import type { LegacyPoolComptroller, Prime, VaiController, VenusLens } from 'libs/contracts';
import type { ChainId, Pool, Token } from 'types';
import type { GetApiPoolsOutput } from '../getApiPools';

export interface GetLegacyPoolInput {
  legacyPoolData: GetApiPoolsOutput['pools'][number];
  chainId: ChainId;
  blocksPerDay: number;
  name: string;
  description: string;
  xvs: Token;
  vai: Token;
  tokens: Token[];
  legacyPoolComptrollerContract: LegacyPoolComptroller;
  venusLensContract: VenusLens;
  vaiControllerContract: VaiController;
  primeContract?: Prime;
  accountAddress?: string;
}

export interface GetLegacyPoolOutput {
  pool: Pool;
}
