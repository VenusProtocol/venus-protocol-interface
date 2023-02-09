import type { Provider } from '@wagmi/core';
import BigNumber from 'bignumber.js';
import { Multicall } from 'ethereum-multicall';
import { Pool } from 'types';

export interface AdditionalTokenInfo {
  [tokenAddress: string]: {
    priceDollars: BigNumber;
    userWalletBalanceWei: BigNumber;
  };
}

export interface GetIsolatedPoolsInput {
  accountAddress?: string;
  multicall: Multicall;
  provider: Provider;
}

export interface GetIsolatedPoolsOutput {
  pools: Pool[];
}
