import { VError } from 'libs/errors';
import { restService } from 'utilities';

import formatToVoters from './formatToVoters';
import type { GetVotersApiResponse, GetVotersInput, GetVotersOutput } from './types';

export * from './types';

export const getVoters = async ({
  proposalId,
  address,
  support,
  limit = 50,
  offset,
}: GetVotersInput): Promise<GetVotersOutput> => {
  const response = await restService<GetVotersApiResponse>({
    endpoint: '/governance/proposals/votes',
    method: 'GET',
    params: {
      support,
      address,
      limit,
      offset,
      proposalId,
    },
  });

  const payload = response.data;

  // @todo Add specific api error handling
  if (payload && 'error' in payload) {
    throw new VError({
      type: 'unexpected',
      code: 'somethingWentWrong',
      data: { exception: payload.error },
    });
  }

  if (!payload) {
    throw new VError({ type: 'unexpected', code: 'somethingWentWrong' });
  }

  return formatToVoters({ payload });
};
