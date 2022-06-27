import { IVoterHistory } from 'types';
import { restService } from 'utilities';
import formatVoterHistoryResponse from './formatVoterHistoryResponse';
import { IGetVoterHistoryResponse } from './types';

export interface IGetVoterHistoryInput {
  page?: number;
  address: string;
}

export interface IGetVoterHistoryOutput {
  voterHistory: IVoterHistory[];
  limit: number;
  offset: number;
  total: number;
}

const getVoterHistory = async ({
  page = 0,
  address,
}: IGetVoterHistoryInput): Promise<IGetVoterHistoryOutput> => {
  const response = await restService<IGetVoterHistoryResponse>({
    endpoint: `/voters/history/${address}`,
    method: 'GET',
    params: {
      limit: 5,
      offset: page * 5,
    },
  });
  const payload = response.data?.data;
  if ('result' in response && response.result === 'error') {
    // @todo Add specific api error handling
    throw new Error(response.message);
  }
  if (!payload) {
    // @todo Add specific api error handling
    throw new Error('Unexpected error retrieving voter history');
  }

  return formatVoterHistoryResponse(payload);
};

export default getVoterHistory;
