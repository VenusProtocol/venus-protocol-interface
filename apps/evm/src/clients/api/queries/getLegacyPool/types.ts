import {
  LegacyPoolComptroller,
  Prime,
  ResilientOracle,
  VaiController,
  VenusLens,
} from 'packages/contracts';
import { Pool, Token } from 'types';

export interface GetLegacyPoolInput {
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
