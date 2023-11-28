import Vi from 'vitest';

import proposalResponse from '__mocks__/api/proposals.json';

import { restService } from 'utilities';

import getProposals from '.';

vi.mock('utilities/restService');

describe('api/queries/getProposals', () => {
  test('returns formatted proposals', async () => {
    (restService as Vi.Mock).mockImplementationOnce(async () => ({
      data: proposalResponse,
      limit: 10,
      next: true,
    }));

    const response = await getProposals({
      limit: 10,
      page: 2,
      accountAddress: undefined,
    });

    expect(restService).toBeCalledWith({
      endpoint: '/governance/proposals',
      method: 'GET',
      next: true,
      params: {
        limit: 10,
        page: 2,
      },
    });

    expect(response).toMatchSnapshot();
  });

  test('Gets called with correct default arguments', async () => {
    (restService as Vi.Mock).mockImplementationOnce(async () => ({
      data: proposalResponse,
    }));

    const response = await getProposals({
      accountAddress: undefined,
    });

    expect(restService).toBeCalledWith({
      endpoint: '/governance/proposals',
      method: 'GET',
      next: true,
      params: {
        limit: 5,
        page: 0,
      },
    });

    expect(response).toMatchSnapshot();
  });
});
