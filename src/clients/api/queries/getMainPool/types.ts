import { ContractTypeByName } from 'packages/contracts';
import { Pool } from 'types';

import { type Provider } from 'clients/web3';

export interface FormatToPoolInput {}

export type FormatToPoolOutput = Pool;

export interface GetMainPoolInput {
  mainPoolComptrollerContract: ContractTypeByName<'mainPoolComptroller'>;
  venusLensContract: ContractTypeByName<'venusLens'>;
  resilientOracleContract: ContractTypeByName<'resilientOracle'>;
  vaiControllerContract: ContractTypeByName<'vaiController'>;
  provider: Provider;
  accountAddress?: string;
}

export interface GetMainPoolOutput {
  pool: Pool;
}
