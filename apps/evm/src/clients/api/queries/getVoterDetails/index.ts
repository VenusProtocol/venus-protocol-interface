import { VError } from 'libs/errors';
import type { Voter } from 'types';
import { restService } from 'utilities';

import formatVoterDetailsResponse from './formatVoterDetailsResponse';
import type { GetVoterDetailsResponse } from './types';

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
  if (payload && 'error' in payload) {
    throw new VError({
      type: 'unexpected',
      code: 'somethingWentWrong',
      data: { message: payload.error },
    });
  }

  if (!payload) {
    throw new VError({ type: 'unexpected', code: 'somethingWentWrongRetrievingVoterDetails' });
  }

  return formatVoterDetailsResponse(payload, address);
};

export default getVoterDetails;
