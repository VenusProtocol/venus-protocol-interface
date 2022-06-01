import { restService } from 'utilities';
import { VError } from 'errors';
import formatToProposal from './formatToProposal';
import { IGetProposalsInput, IProposalApiResponse, IGetProposalsOutput } from './types';

export * from './types';

const getProposals = async ({
  offset = 0,
  limit = 5,
}: IGetProposalsInput): Promise<IGetProposalsOutput> => {
  const response = await restService<IProposalApiResponse>({
    endpoint: '/proposals',
    method: 'GET',
    params: { offset, limit },
  });
  const payload = response.data?.data;

  // @todo Add specific api error handling
  if ('result' in response && response.result === 'error') {
    throw new VError({
      type: 'unexpected',
      code: 'genericApi',
      data: { message: response.message },
    });
  }

  if (!payload) {
    throw new VError({ type: 'unexpected', code: 'genericApi' });
  }

  const { page, limit: payloadLimit, total } = payload;
  const proposals = payload.result.map(p => formatToProposal(p));

  return { proposals, page, limit: payloadLimit, total };
};

export default getProposals;
