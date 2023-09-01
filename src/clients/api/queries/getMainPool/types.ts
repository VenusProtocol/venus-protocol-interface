import { ContractTypeByName } from 'packages/contracts';
import { Pool } from 'types';

export interface GetMainPoolInput {
  name: string;
  description: string;
  mainPoolComptrollerContract: ContractTypeByName<'mainPoolComptroller'>;
  venusLensContract: ContractTypeByName<'venusLens'>;
  resilientOracleContract: ContractTypeByName<'resilientOracle'>;
  vaiControllerContract: ContractTypeByName<'vaiController'>;
  accountAddress?: string;
}

export interface GetMainPoolOutput {
  pool: Pool;
}
