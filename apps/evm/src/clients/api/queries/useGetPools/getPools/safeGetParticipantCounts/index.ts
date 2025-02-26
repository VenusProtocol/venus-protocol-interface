import { logError } from 'libs/errors';
import type { ChainId } from 'types';
import { getParticipantCounts } from '../getParticipantCounts';

interface GetPoolParticipantsCountInput {
  chainId: ChainId;
}

export const safeGetParticipantsCounts = async ({ chainId }: GetPoolParticipantsCountInput) => {
  try {
    const result = await getParticipantCounts({ chainId });
    return result;
  } catch (error) {
    // Safari throws a "TypeError: Load failed" error if the fetch is canceled
    // e.g., if the user navigates away from the page before the request is finished
    // we can safely filter them out from being logged
    if (error instanceof Error && error.name === 'TypeError' && error.message === 'Load failed') {
      return undefined;
    }
    // Log error without throwing to prevent the entire query from failing, since this relies on a
    // third-party service that could be down and doesn't constitute a critical failure
    logError(error);
  }
};
