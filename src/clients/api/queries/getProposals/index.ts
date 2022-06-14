import { restService } from 'utilities';
import { VError } from 'errors';
import formatToProposal from './formatToProposal';
import { IGetProposalsInput, IProposalApiResponse, IGetProposalsOutput } from './types';

export * from './types';

const getProposals = async ({
  page = 0,
  limit = 5,
}: IGetProposalsInput): Promise<IGetProposalsOutput> => {
  const offset = page * limit;

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
      code: 'somethingWentWrong',
      data: { message: response.message },
    });
  }

  if (!payload) {
    throw new VError({ type: 'unexpected', code: 'somethingWentWrong' });
  }

  const { limit: payloadLimit, total, offset: payloadOffset } = payload;
  const proposals = payload.result.map(p => formatToProposal(p));

  return { proposals, limit: payloadLimit, total, offset: payloadOffset };
};

export default getProposals;
