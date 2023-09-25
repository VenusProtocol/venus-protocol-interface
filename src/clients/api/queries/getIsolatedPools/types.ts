import { ContractTypeByName } from 'packages/contracts';
import { Pool, Token } from 'types';

import { type Provider } from 'clients/web3';

export interface GetIsolatedPoolsInput {
  tokens: Token[];
  provider: Provider;
  poolRegistryContractAddress: string;
  poolLensContract: ContractTypeByName<'poolLens'>;
  resilientOracleContract: ContractTypeByName<'resilientOracle'>;
  accountAddress?: string;
}

export interface GetIsolatedPoolsOutput {
  pools: Pool[];
}
