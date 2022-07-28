import { VError } from 'errors';
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
  offset: number;
  total: number;
}

const getVoterHistory = async ({
  page = 0,
  address,
}: GetVoterHistoryInput): Promise<GetVoterHistoryOutput> => {
  const response = await restService<GetVoterHistoryResponse>({
    endpoint: `/voters/history/${address}`,
    method: 'GET',
    params: {
      limit: 6,
      offset: page * 6,
    },
  });

  const payload = response.data?.data;

  // @todo Add specific api error handling
  if ('result' in response && response.result === 'error') {
    throw new VError({
      type: 'unexpected',
      code: 'somethingWentWrong',
      data: { message: response.message },
    });
  }

  if (!payload) {
    throw new VError({ type: 'unexpected', code: 'somethingWentWrongRetrievingVoterHistory' });
  }

  return formatVoterHistoryResponse(payload);
};

export default getVoterHistory;
