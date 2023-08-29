import { ContractCallReturnContext, Multicall } from 'ethereum-multicall';
import { ContractTypeByName } from 'packages/contracts';
import { Pool } from 'types';

import { getIsolatedPoolParticipantsCount } from 'clients/subgraph';
import { type Provider } from 'clients/web3';

import { GetTokenBalancesOutput } from '../getTokenBalances';

export interface FormatToPoolInput {
  poolsResults: Awaited<ReturnType<ContractTypeByName<'poolLens'>['getAllPools']>>;
  comptrollerResults: ContractCallReturnContext[];
  rewardsDistributorsResults: ContractCallReturnContext[];
  resilientOracleResult: ContractCallReturnContext;
  currentBlockNumber: number;
  poolParticipantsCountResult?: Awaited<ReturnType<typeof getIsolatedPoolParticipantsCount>>;
  poolLensResult?: ContractCallReturnContext;
  userWalletTokenBalances?: GetTokenBalancesOutput;
}

export type FormatToPoolsOutput = Pool[];

export interface GetIsolatedPoolsInput {
  multicall: Multicall;
  poolLensContract: ContractTypeByName<'poolLens'>;
  poolRegistryContractAddress: string;
  resilientOracleContractAddress: string;
  provider: Provider;
  accountAddress?: string;
}

export interface GetIsolatedPoolsOutput {
  pools: Pool[];
}
