import { VError } from 'errors';
import { VoterAccount } from 'types';
import { restService } from 'utilities';

import formatVoterAccountResponse from './formatVoterAccountResponse';
import { GetVoterAccountsResponse } from './types';

export interface GetVoterAccountsInput {
  page?: number;
}

export interface GetVoterAccountsOutput {
  voterAccounts: VoterAccount[];
  limit: number;
  offset: number;
  total: number;
}

const getVoterAccounts = async ({
  page = 0,
}: GetVoterAccountsInput): Promise<GetVoterAccountsOutput> => {
  const response = await restService<GetVoterAccountsResponse>({
    endpoint: '/governance/voters',
    method: 'GET',
    params: {
      limit: 16,
      offset: page * 16,
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
    throw new VError({ type: 'unexpected', code: 'somethingWentWrongRetrievingVoterAccounts' });
  }

  return formatVoterAccountResponse(payload);
};

export default getVoterAccounts;
