import type { Provider } from '@wagmi/core';
import BigNumber from 'bignumber.js';
import { Multicall } from 'ethereum-multicall';
import { Pool } from 'types';

import { IsolatedPoolsQuery } from 'clients/subgraph';

export interface FormatToPoolInput {
  subgraphPool: IsolatedPoolsQuery['pools'][number];
  tokenPricesDollars: {
    [tokenAddress: string]: BigNumber;
  };
  userWalletBalances?: {
    [tokenAddress: string]: BigNumber;
  };
}

export type FormatToPoolOutput = Pool;

export interface GetIsolatedPoolsInput {
  accountAddress?: string;
  multicall: Multicall;
  provider: Provider;
}

export interface GetIsolatedPoolsOutput {
  pools: Pool[];
}
