import { VError } from 'errors';
import { IVoterAccount } from 'types';
import { restService } from 'utilities';

import formatVoterAccountResponse from './formatVoterAccountResponse';
import { IGetVoterAccountsResponse } from './types';

export interface IGetVoterAccountsInput {
  page?: number;
}

export interface IGetVoterAccountsOutput {
  voterAccounts: IVoterAccount[];
  limit: number;
  offset: number;
  total: number;
}

const getVoterAccounts = async ({
  page = 0,
}: IGetVoterAccountsInput): Promise<IGetVoterAccountsOutput> => {
  const response = await restService<IGetVoterAccountsResponse>({
    endpoint: '/voters/accounts',
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
