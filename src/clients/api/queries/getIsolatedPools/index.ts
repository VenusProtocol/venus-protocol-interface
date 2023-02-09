import BigNumber from 'bignumber.js';
import { Token } from 'types';
import { getVTokenByAddress } from 'utilities';

import { getIsolatedPools as getSubgraphIsolatedPools } from 'clients/subgraph';

import getTokenBalances, { GetTokenBalancesOutput } from '../getTokenBalances';
import formatToPool from './formatToPool';
import { AdditionalTokenInfo, GetIsolatedPoolsInput, GetIsolatedPoolsOutput } from './types';

export type { GetIsolatedPoolsInput, GetIsolatedPoolsOutput } from './types';

// TODO: add tests

const getIsolatedPools = async ({
  accountAddress,
  multicall,
  provider,
}: GetIsolatedPoolsInput): Promise<GetIsolatedPoolsOutput> => {
  // Fetch isolated pools from subgraph
  const subgraphIsolatedPools = await getSubgraphIsolatedPools({
    accountAddress,
  });

  const additionalTokenInfo: AdditionalTokenInfo = {};

  // Extract all tokens
  const tokens = (subgraphIsolatedPools.pools || []).reduce<Token[]>((accTokens, pool) => {
    const poolTokens = pool.markets.reduce<Token[]>((accPoolTokens, market) => {
      const vToken = getVTokenByAddress(market.id);
      const isAlreadyListed =
        !!vToken &&
        accTokens.some(
          listedToken =>
            listedToken.address.toLowerCase() === vToken.underlyingToken.address.toLowerCase(),
        );

      return vToken && !isAlreadyListed
        ? [...accPoolTokens, vToken.underlyingToken]
        : accPoolTokens;
    }, []);

    return accTokens.concat(poolTokens);
  }, []);

  // Add promise to fetch dollar prices

  const promises: [Promise<GetTokenBalancesOutput> | undefined] = [];

  if (accountAddress) {
    // Add promise to fetch user wallet balances
    promises.push(
      getTokenBalances({
        accountAddress,
        multicall,
        provider,
        tokens,
      }),
    );
  }

  const [userWalletBalances] = await Promise.all(promises);

  tokens.forEach(token => {
    additionalTokenInfo[token.address.toLowerCase()] = {
      priceDollars: new BigNumber(1),
      userWalletBalanceWei:
        userWalletBalances?.tokenBalances.find(
          balance => balance.token.address.toLowerCase() === token.address.toLowerCase(),
        )?.balanceWei || new BigNumber(0),
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
