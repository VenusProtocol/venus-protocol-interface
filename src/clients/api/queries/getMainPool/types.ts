import { MainPoolComptroller, ResilientOracle, VaiController, VenusLens } from 'packages/contracts';
import { Pool, Token } from 'types';

export interface GetMainPoolInput {
  name: string;
  description: string;
  xvs: Token;
  vai: Token;
  tokens: Token[];
  mainPoolComptrollerContract: MainPoolComptroller;
  venusLensContract: VenusLens;
  resilientOracleContract: ResilientOracle;
  vaiControllerContract: VaiController;
  accountAddress?: string;
}

export interface GetMainPoolOutput {
  pool: Pool;
}
