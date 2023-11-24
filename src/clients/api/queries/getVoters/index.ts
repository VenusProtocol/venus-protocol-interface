import { VError } from 'packages/errors';
import { restService } from 'utilities';

import formatToVoters from './formatToVoters';
import { GetVotersApiResponse, GetVotersInput, GetVotersOutput } from './types';

export * from './types';

const getVoters = async ({
  proposalId,
  address,
  support,
  limit = 50,
  offset,
}: GetVotersInput): Promise<GetVotersOutput> => {
  const response = await restService<GetVotersApiResponse>({
    endpoint: '/governance/proposals/votes',
    method: 'GET',
    next: true,
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
  if ('result' in response && response.result === 'error') {
    throw new VError({
      type: 'unexpected',
      code: 'somethingWentWrong',
      data: { message: response.message },
    });
  }

  if (!payload) {
    throw new VError({ type: 'unexpected', code: 'somethingWentWrong' });
  }

  return formatToVoters({ payload });
};

export default getVoters;
