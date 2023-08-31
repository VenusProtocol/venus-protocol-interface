import { Multicall as Multicall3 } from 'ethereum-multicall';
import { ContractTypeByName } from 'packages/contracts';
import { Pool } from 'types';

import { type Provider } from 'clients/web3';

export interface GetIsolatedPoolsInput {
  multicall3: Multicall3;
  poolLensContract: ContractTypeByName<'poolLens'>;
  poolRegistryContractAddress: string;
  resilientOracleContractAddress: string;
  provider: Provider;
  accountAddress?: string;
}

export interface GetIsolatedPoolsOutput {
  pools: Pool[];
}
