import { VError } from 'packages/errors';
import { restService } from 'utilities';

import formatToVoteSummary from './formatToVoteSummary';
import { GetVoteSummaryApiResponse, GetVoteSummaryInput, GetVoteSummaryOutput } from './types';

export * from './types';

const getVoteSummary = async ({
  proposalId,
}: GetVoteSummaryInput): Promise<GetVoteSummaryOutput> => {
  const response = await restService<GetVoteSummaryApiResponse>({
    endpoint: `/governance/proposals/${proposalId}/voteSummary`,
    method: 'GET',
    next: true,
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

  return formatToVoteSummary({ payload });
};

export default getVoteSummary;
