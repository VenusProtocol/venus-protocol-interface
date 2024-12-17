import { getIsolatedPoolParticipantsCount } from 'clients/subgraph';
import type { ChainId } from 'types';
import type { MarketParticipantsCounts } from '../../types';

export const getIsolatedPoolParticipantCounts = async ({ chainId }: { chainId: ChainId }) => {
  const isolatedPoolParticipantsCount = await getIsolatedPoolParticipantsCount({ chainId });

  const isolatedPoolParticipantsCountMap = new Map<string, MarketParticipantsCounts>();
  (isolatedPoolParticipantsCount?.pools || []).forEach(pool =>
    pool.markets.forEach(market => {
      isolatedPoolParticipantsCountMap.set(market.id.toLowerCase(), {
        borrowerCount: +market.borrowerCount,
        supplierCount: +market.supplierCount,
      });
    }),
  );

  return { isolatedPoolParticipantsCountMap };
};
