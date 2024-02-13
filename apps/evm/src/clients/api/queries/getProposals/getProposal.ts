import { VError } from 'libs/errors';

import { formatToProposal, restService } from 'utilities';

import type { GetProposalInput, GetProposalOutput, ProposalApiResponse } from './types';

const getProposal = async ({
  proposalId,
  accountAddress = '',
}: GetProposalInput): Promise<GetProposalOutput> => {
  const response = await restService<ProposalApiResponse>({
    endpoint: `/governance/proposals/${proposalId}`,
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
    throw new VError({ type: 'unexpected', code: 'somethingWentWrong' });
  }

  return formatToProposal({ ...payload, accountAddress });
};

export default getProposal;
