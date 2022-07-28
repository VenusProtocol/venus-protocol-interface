import { VError } from 'errors';
import { formatToProposal, restService } from 'utilities';

import { GetProposalInput, GetProposalOutput, ProposalApiResponse } from './types';

const getProposal = async ({ id }: GetProposalInput): Promise<GetProposalOutput> => {
  const response = await restService<ProposalApiResponse>({
    endpoint: `/proposals/${id}`,
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
    throw new VError({ type: 'unexpected', code: 'somethingWentWrong' });
  }

  return formatToProposal(payload);
};

export default getProposal;
