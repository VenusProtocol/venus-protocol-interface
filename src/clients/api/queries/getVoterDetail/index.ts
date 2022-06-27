import { IVoterDetail } from 'types';
import { restService } from 'utilities';
import formatVoterDetailResponse from './formatVoterDetailResponse';
import { IGetVoterDetailResponse } from './types';

export interface IGetVoterDetailInput {
  address: string;
}

export type GetVoterDetailOutput = IVoterDetail;

const getVoterDetail = async ({ address }: IGetVoterDetailInput): Promise<GetVoterDetailOutput> => {
  const response = await restService<IGetVoterDetailResponse>({
    endpoint: `/voters/accounts/${address}`,
    method: 'GET',
  });
  const payload = response.data?.data;
  if ('result' in response && response.result === 'error') {
    // @todo Add specific api error handling
    throw new Error(response.message);
  }
  if (!payload) {
    // @todo Add specific api error handling
    throw new Error('Unexpected error retrieving voter details');
  }

  return formatVoterDetailResponse(payload, address);
};

export default getVoterDetail;
