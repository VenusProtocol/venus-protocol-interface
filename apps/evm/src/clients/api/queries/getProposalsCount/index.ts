import { VError } from 'libs/errors';
import { restService } from 'utilities';

export type ProposalsResponseData = {
  total: number;
};

export async function fetchProposalCount() {
  const response = await restService<ProposalsResponseData>({
    endpoint: '/governance/proposals?limit=1',
    method: 'GET',
  });

  const payload = response.data;

  if (payload && 'error' in payload) {
    throw new VError({
      type: 'unexpected',
      code: 'somethingWentWrong',
      data: { exception: payload.error },
    });
  }

  if (!payload) {
    throw new VError({ type: 'unexpected', code: 'somethingWentWrong' });
  }

  return payload.total;
}
