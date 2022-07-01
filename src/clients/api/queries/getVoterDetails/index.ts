import { IVoterDetails } from 'types';
import { restService } from 'utilities';
import formatVoterDetailsResponse from './formatVoterDetailsResponse';
import { IGetVoterDetailsResponse } from './types';

export interface IGetVoterDetailsInput {
  address: string;
}

export type GetVoterDetailsOutput = IVoterDetails;

const getVoterDetails = async ({
  address,
}: IGetVoterDetailsInput): Promise<GetVoterDetailsOutput> => {
  const response = await restService<IGetVoterDetailsResponse>({
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

  return formatVoterDetailsResponse(payload, address);
};

export default getVoterDetails;
