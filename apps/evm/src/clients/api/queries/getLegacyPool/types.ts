import type {
  LegacyPoolComptroller,
  Prime,
  ResilientOracle,
  VaiController,
  VenusLens,
} from 'libs/contracts';
import type { ChainId, Pool, Token } from 'types';

export interface GetLegacyPoolInput {
  chainId: ChainId;
  blocksPerDay: number;
  name: string;
  description: string;
  xvs: Token;
  vai: Token;
  tokens: Token[];
  legacyPoolComptrollerContract: LegacyPoolComptroller;
  venusLensContract: VenusLens;
  resilientOracleContract: ResilientOracle;
  vaiControllerContract: VaiController;
  primeContract?: Prime;
  accountAddress?: string;
}

export interface GetLegacyPoolOutput {
  pool: Pool;
}
