import { VError } from 'errors';
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
  // @todo Add specific api error handling
  if ('result' in response && response.result === 'error') {
    throw new VError({
      type: 'unexpected',
      code: 'somethingWentWrong',
      data: { message: response.message },
    });
  }

  if (!payload) {
    throw new VError({ type: 'unexpected', code: 'somethingWentWrongRetrievingVoterDetails' });
  }

  return formatVoterDetailsResponse(payload, address);
};

export default getVoterDetails;
