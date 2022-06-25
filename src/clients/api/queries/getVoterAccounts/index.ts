import { VoterAccount } from 'types';
import { restService } from 'utilities';
import formatVoterAccountResponse from './formatVoterAccountResponse';
import { IGetVoterAccountsResponse } from './types';

export interface IGetVoterAccountsInput {
  page?: number;
}

export interface IGetVoterAccountsOutput {
  voterAccounts: VoterAccount[];
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
  if ('result' in response && response.result === 'error') {
    // @todo Add specific api error handling
    throw new Error(response.message);
  }
  if (!payload) {
    // @todo Add specific api error handling
    throw new Error('Unexpected error retrieving voter accounts');
  }

  return formatVoterAccountResponse(payload);
};

export default getVoterAccounts;
