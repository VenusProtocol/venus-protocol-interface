import { ContractTypeByName } from 'packages/contracts';
import { Pool, Token } from 'types';

export interface GetMainPoolInput {
  name: string;
  description: string;
  xvs: Token;
  vai: Token;
  tokens: Token[];
  mainPoolComptrollerContract: ContractTypeByName<'mainPoolComptroller'>;
  venusLensContract: ContractTypeByName<'venusLens'>;
  resilientOracleContract: ContractTypeByName<'resilientOracle'>;
  vaiControllerContract: ContractTypeByName<'vaiController'>;
  accountAddress?: string;
}

export interface GetMainPoolOutput {
  pool: Pool;
}
