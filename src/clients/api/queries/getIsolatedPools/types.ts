import type { Provider } from '@wagmi/core';
import { ContractCallReturnContext, Multicall } from 'ethereum-multicall';
import { Pool } from 'types';

import { getIsolatedPoolParticipantsCount } from 'clients/subgraph';
import { PoolLens } from 'types/contracts';

import { GetTokenBalancesOutput } from '../getTokenBalances';

export interface FormatToPoolInput {
  poolsResults: PoolLens.PoolDataStructOutput[];
  poolParticipantsCountResult: Awaited<ReturnType<typeof getIsolatedPoolParticipantsCount>>;
  comptrollerResults: ContractCallReturnContext[];
  rewardsDistributorsResults: ContractCallReturnContext[];
  poolLensResult: ContractCallReturnContext;
  accountAddress?: string;
  userWalletTokenBalances?: GetTokenBalancesOutput;
}

export type FormatToPoolsOutput = Pool[];

export interface GetIsolatedPoolsInput {
  multicall: Multicall;
  poolLensContract: PoolLens;
  provider: Provider;
  accountAddress?: string;
}

export interface GetIsolatedPoolsOutput {
  pools: Pool[];
}
