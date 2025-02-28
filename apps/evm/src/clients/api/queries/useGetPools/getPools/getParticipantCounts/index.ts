import {
  getBscCorePoolParticipantsCount,
  getIsolatedPoolParticipantsCount,
} from 'clients/subgraph';
import { logError } from 'libs/errors';
import { ChainId } from 'types';
import { extractSettledPromiseValue } from 'utilities';
import type { MarketParticipantsCounts } from '../../types';

export const getParticipantCounts = async ({ chainId }: { chainId: ChainId }) => {
  const participantsCountMap = new Map<string, MarketParticipantsCounts>();
  const [isolatedPoolParticipantsCountsResult, bscCorePoolParticipantsCountsResult] =
    await Promise.allSettled([
      getIsolatedPoolParticipantsCount({ chainId }),
      chainId === ChainId.BSC_MAINNET || chainId === ChainId.BSC_TESTNET
        ? getBscCorePoolParticipantsCount({ chainId })
        : undefined,
    ]);

  if (isolatedPoolParticipantsCountsResult.status === 'rejected') {
    logError(isolatedPoolParticipantsCountsResult.reason);
  }

  if (bscCorePoolParticipantsCountsResult.status === 'rejected') {
    logError(bscCorePoolParticipantsCountsResult.reason);
  }

  const isolatedPoolParticipantsCounts = (
    extractSettledPromiseValue(isolatedPoolParticipantsCountsResult)?.pools || []
  ).flatMap(p => p.markets);
  const bscCorePoolParticipantsCounts =
    extractSettledPromiseValue(bscCorePoolParticipantsCountsResult)?.markets || [];

  [...isolatedPoolParticipantsCounts, ...bscCorePoolParticipantsCounts].forEach(market => {
    participantsCountMap.set(market.id.toLowerCase(), {
      borrowerCount: +market.borrowerCount,
      supplierCount: +market.supplierCount,
    });
  });
  return { participantsCountMap };
};
