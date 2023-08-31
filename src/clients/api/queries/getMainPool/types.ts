import BigNumber from 'bignumber.js';
import { ContractTypeByName } from 'packages/contracts';
import { Pool } from 'types';

import { type Provider } from 'clients/web3';

export interface UnderlyingTokenPriceMantissas {
  [vTokenAddress: string]: BigNumber | undefined;
}

export interface GetMainPoolInput {
  name: string;
  description: string;
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
