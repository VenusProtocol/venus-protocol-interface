import BigNumber from 'bignumber.js';

import { VError } from 'libs/errors';
import { VoterAccount } from 'types';
import { restService } from 'utilities';

import formatVoterAccountResponse from './formatVoterAccountResponse';
import { GetVoterAccountsResponse } from './types';

export interface GetVoterAccountsInput {
  totalStakedXvs: BigNumber;
  limit?: number;
  page?: number;
}

export interface GetVoterAccountsOutput {
  voterAccounts: VoterAccount[];
  limit: number;
  offset: number;
  total: number;
}

const getVoterAccounts = async ({
  totalStakedXvs,
  limit = 16,
  page = 0,
}: GetVoterAccountsInput): Promise<GetVoterAccountsOutput> => {
  const response = await restService<GetVoterAccountsResponse>({
    endpoint: '/governance/voters',
    method: 'GET',
    params: {
      limit,
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
    throw new VError({ type: 'unexpected', code: 'somethingWentWrongRetrievingVoterAccounts' });
  }

  return formatVoterAccountResponse({ data: payload, totalStakedXvs });
};

export default getVoterAccounts;
