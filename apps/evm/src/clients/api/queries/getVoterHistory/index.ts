import { VError } from 'libs/errors';
import { VoterHistory } from 'types';
import { restService } from 'utilities';

import formatVoterHistoryResponse from './formatVoterHistoryResponse';
import { GetVoterHistoryResponse } from './types';

export interface GetVoterHistoryInput {
  page?: number;
  address: string;
}

export interface GetVoterHistoryOutput {
  voterHistory: VoterHistory[];
  limit: number;
  total: number;
}

const getVoterHistory = async ({
  page = 0,
  address,
}: GetVoterHistoryInput): Promise<GetVoterHistoryOutput> => {
  const response = await restService<GetVoterHistoryResponse>({
    endpoint: `/governance/voters/${address}/history`,
    method: 'GET',
    params: {
      limit: 6,
      page,
    },
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
    throw new VError({ type: 'unexpected', code: 'somethingWentWrongRetrievingVoterHistory' });
  }

  return formatVoterHistoryResponse(payload);
};

export default getVoterHistory;
