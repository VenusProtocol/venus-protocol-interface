import { IVoterHistory } from 'types';
import { restService } from 'utilities';
import { VError } from 'errors';
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
