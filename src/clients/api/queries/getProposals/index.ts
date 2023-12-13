import { VError } from 'packages/errors';
import { formatToProposal, restService } from 'utilities';

import { GetProposalsInput, GetProposalsOutput, ProposalsApiResponse } from './types';

export * from './types';

const getProposals = async ({
  page = 0,
  limit = 5,
  accountAddress = '',
}: GetProposalsInput): Promise<GetProposalsOutput> => {
  const response = await restService<ProposalsApiResponse>({
    endpoint: '/governance/proposals',
    method: 'GET',
    params: { page, limit },
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

  const { limit: payloadLimit, total, page: payloadPage } = payload;
  const proposals = payload.result.map(p => formatToProposal({ ...p, accountAddress }));

  return { proposals, limit: payloadLimit, total, page: payloadPage };
};

export default getProposals;
