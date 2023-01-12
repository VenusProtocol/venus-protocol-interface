import BigNumber from 'bignumber.js';

import { getIsolatedPools as getSubgraphIsolatedPools } from 'clients/subgraph';

import formatToPool from './formatToPool';
import { AdditionalTokenInfo, GetIsolatedPoolsInput, GetIsolatedPoolsOutput } from './types';

export type { GetIsolatedPoolsInput, GetIsolatedPoolsOutput } from './types';

// TODO: add tests

const getIsolatedPools = async ({
  accountAddress,
}: GetIsolatedPoolsInput): Promise<GetIsolatedPoolsOutput> => {
  // Fetch isolated pools from subgraph
  const subgraphIsolatedPools = await getSubgraphIsolatedPools({
    accountAddress,
  });

  // Extract all token addresses
  const vTokenAddresses = (subgraphIsolatedPools.pools || []).reduce<string[]>(
    (acc, pool) => acc.concat(pool.markets.map(market => market.id.toLowerCase())),
    [],
  );

  // TODO: fetch
  const additionalTokenInfo: AdditionalTokenInfo = {};

  vTokenAddresses.forEach(vTokenAddress => {
    additionalTokenInfo[vTokenAddress] = {
      priceDollars: new BigNumber(1),
      userWalletBalanceWei: new BigNumber(1000000000000),
    };
  });

  const pools = (subgraphIsolatedPools.pools || []).map(subgraphPool =>
    formatToPool({
      subgraphPool,
      additionalTokenInfo,
    }),
  );

  return {
    pools,
  };
};

export default getIsolatedPools;
