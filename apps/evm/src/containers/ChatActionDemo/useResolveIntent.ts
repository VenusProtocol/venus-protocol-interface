import { useCallback } from 'react';

import { useGetPools } from 'clients/api';
import { useMarketPageTo } from 'hooks/useMarketPageTo';

import type { ChatIntent } from './workflows';

/**
 * Turns a `ChatIntent` (an action and a token symbol) into a market page link.
 *
 * This is the trusted half of the demo: the comptroller and vToken addresses come out of the app's
 * own pool data, never out of the message that produced the intent. The worst a bad intent can do
 * is name a market that does not exist on the current chain, which resolves to `undefined` and
 * shows as "market not found" rather than a link to an arbitrary address.
 *
 * The action names double as the tab ids read by `MarketForm` via `?tab=`, so no mapping table is
 * needed — see `containers/MarketForm`.
 */
export const useResolveIntent = () => {
  const { data: getPoolsData, isLoading } = useGetPools();
  const { formatMarketPageTo } = useMarketPageTo();

  const resolveIntent = useCallback(
    (intent: ChatIntent) => {
      const pools = getPoolsData?.pools ?? [];

      // Core pool first: a symbol can be listed in several isolated pools, and the core market is
      // the one a user asking "supply USDT" almost always means.
      const sortedPools = [...pools].sort((a, b) => Number(a.isIsolated) - Number(b.isIsolated));

      for (const pool of sortedPools) {
        const asset = pool.assets.find(
          ({ vToken }) =>
            vToken.underlyingToken.symbol.toUpperCase() === intent.symbol.toUpperCase(),
        );

        if (asset) {
          return {
            to: formatMarketPageTo({
              poolComptrollerContractAddress: pool.comptrollerAddress,
              vTokenAddress: asset.vToken.address,
              tabId: intent.action,
            }),
            poolName: pool.name,
          };
        }
      }

      return undefined;
    },
    [getPoolsData, formatMarketPageTo],
  );

  return { resolveIntent, isLoading };
};
