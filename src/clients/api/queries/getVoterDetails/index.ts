import { VError } from 'packages/errors';
import { Voter } from 'types';
import { restService } from 'utilities';

import formatVoterDetailsResponse from './formatVoterDetailsResponse';
import { GetVoterDetailsResponse } from './types';

export interface GetVoterDetailsInput {
  address: string;
}

export type GetVoterDetailsOutput = Voter;

const getVoterDetails = async ({
  address,
}: GetVoterDetailsInput): Promise<GetVoterDetailsOutput> => {
  const response = await restService<GetVoterDetailsResponse>({
    endpoint: `/governance/voters/${address}/summary`,
    method: 'GET',
  });
  const payload = response.data;
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
