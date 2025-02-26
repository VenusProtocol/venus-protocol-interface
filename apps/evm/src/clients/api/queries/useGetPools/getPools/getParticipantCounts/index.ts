import {
  getBscCorePoolParticipantsCount,
  getIsolatedPoolParticipantsCount,
} from 'clients/subgraph';
import { ChainId } from 'types';
import type { MarketParticipantsCounts } from '../../types';

export const getParticipantCounts = async ({ chainId }: { chainId: ChainId }) => {
  const participantsCountMap = new Map<string, MarketParticipantsCounts>();
  if (chainId === ChainId.BSC_MAINNET || chainId === ChainId.BSC_TESTNET) {
    const bscCorePoolParticipantsCount = await getBscCorePoolParticipantsCount({ chainId });
    (bscCorePoolParticipantsCount?.markets || []).forEach(market => {
      participantsCountMap.set(market.id.toLowerCase(), {
        borrowerCount: +market.borrowerCount,
        supplierCount: +market.supplierCount,
      });
    });

    const isolatedPoolParticipantsCount = await getIsolatedPoolParticipantsCount({ chainId });
    (isolatedPoolParticipantsCount?.pools || []).forEach(pool =>
      pool.markets.forEach(market => {
        participantsCountMap.set(market.id.toLowerCase(), {
          borrowerCount: +market.borrowerCount,
          supplierCount: +market.supplierCount,
        });
      }),
    );

    return { participantsCountMap };
  }
};
