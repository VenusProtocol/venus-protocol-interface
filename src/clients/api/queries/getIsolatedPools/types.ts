import BigNumber from 'bignumber.js';
import { Pool } from 'types';

export interface AdditionalTokenInfo {
  [tokenAddress: string]: {
    priceDollars: BigNumber;
    userWalletBalanceWei: BigNumber;
  };
}

export interface GetIsolatedPoolsInput {
  accountAddress?: string;
}

export interface GetIsolatedPoolsOutput {
  pools: Pool[];
}
