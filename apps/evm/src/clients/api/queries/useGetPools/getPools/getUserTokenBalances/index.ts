import { getTokenBalances } from 'clients/api';
import { NATIVE_TOKEN_ADDRESS } from 'constants/address';
import type { PoolLens, VenusLens } from 'libs/contracts';
import type { Provider } from 'libs/wallet';
import type { ChainId, Token } from 'types';
import { findTokenByAddress, isPoolIsolated } from 'utilities';
import type { ApiPool } from '../getApiPools';

export const getUserTokenBalances = async ({
  accountAddress,
  apiPools,
  chainId,
  tokens,
  provider,
  poolLensContract,
  venusLensContract,
}: {
  accountAddress: string;
  apiPools: ApiPool[];
  chainId: ChainId;
  tokens: Token[];
  provider: Provider;
  poolLensContract: PoolLens;
  venusLensContract?: VenusLens;
}) => {
  // Extract token records and addresses
  const [legacyPoolVTokenAddresses, isolatedPoolsVTokenAddresses, underlyingTokens] =
    apiPools.reduce<[string[], string[], Token[]]>(
      (acc, pool) => {
        const newLegacyPoolVTokenAddresses: string[] = [];
        const newIsolatedPoolsVTokenAddresses: string[] = [];
        const newUnderlyingTokens: Token[] = [];
        const newUnderlyingTokenAddresses: string[] = [];

        pool.markets.forEach(market => {
          const isIsolated = isPoolIsolated({
            chainId,
            comptrollerAddress: pool.address,
          });

          // VToken addresses are unique
          if (isIsolated) {
            newIsolatedPoolsVTokenAddresses.push(market.address.toLowerCase());
          } else {
            newLegacyPoolVTokenAddresses.push(market.address.toLowerCase());
          }

          const underlyingToken = findTokenByAddress({
            address: market.underlyingAddress || NATIVE_TOKEN_ADDRESS,
            tokens,
          });

          if (
            underlyingToken &&
            !newUnderlyingTokenAddresses.includes(underlyingToken.address.toLowerCase())
          ) {
            newUnderlyingTokens.push(underlyingToken);
            newUnderlyingTokenAddresses.push(underlyingToken.address.toLowerCase());
          }
        });

        return [
          acc[0].concat(newLegacyPoolVTokenAddresses),
          acc[1].concat(newIsolatedPoolsVTokenAddresses),
          acc[2].concat(newUnderlyingTokens),
        ];
      },
      [[], [], []],
    );

  const [userTokenBalances, userIsolatedPoolVTokenBalances, userLegacyPoolVTokenBalances] =
    await Promise.all([
      getTokenBalances({
        accountAddress,
        tokens: underlyingTokens,
        provider,
      }),
      poolLensContract.callStatic.vTokenBalancesAll(isolatedPoolsVTokenAddresses, accountAddress),
      venusLensContract
        ? venusLensContract.callStatic.vTokenBalancesAll(legacyPoolVTokenAddresses, accountAddress)
        : undefined,
    ]);

  return {
    userTokenBalances,
    userIsolatedPoolVTokenBalances,
    userLegacyPoolVTokenBalances,
  };
};
