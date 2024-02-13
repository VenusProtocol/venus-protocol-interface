import { VError } from 'libs/errors';

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
  });

  const payload = response.data;

  // @todo Add specific api error handling
  if (payload && 'error' in payload) {
    throw new VError({
      type: 'unexpected',
      code: 'somethingWentWrong',
      data: { message: payload.error },
    });
  }

  if (!payload) {
    throw new VError({ type: 'unexpected', code: 'somethingWentWrong' });
  }

  return formatToVoteSummary({ payload });
};

export default getVoteSummary;
