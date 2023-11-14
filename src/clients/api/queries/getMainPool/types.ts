import BigNumber from 'bignumber.js';
import {
  MainPoolComptroller,
  Prime,
  ResilientOracle,
  VaiController,
  VenusLens,
} from 'packages/contracts';
import { Pool, Token } from 'types';

export interface GetMainPoolInput {
  blocksPerDay: number;
  name: string;
  description: string;
  xvs: Token;
  vai: Token;
  tokens: Token[];
  mainPoolComptrollerContract: MainPoolComptroller;
  venusLensContract: VenusLens;
  resilientOracleContract: ResilientOracle;
  vaiControllerContract: VaiController;
  primeContract?: Prime;
  accountAddress?: string;
}

export interface GetMainPoolOutput {
  pool: Pool;
}

export interface PrimeApy {
  borrowApy: BigNumber;
  supplyApy: BigNumber;
}
