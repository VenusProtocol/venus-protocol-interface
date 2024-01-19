import Vi from 'vitest';

import votersResponse from '__mocks__/api/voters.json';

import { restService } from 'utilities';

import getVoters from '.';

vi.mock('utilities/restService');

describe('api/queries/getVoters', () => {
  test('returns votes', async () => {
    (restService as Vi.Mock).mockImplementationOnce(async () => ({
      status: 200,
      data: votersResponse,
    }));

    const response = await getVoters({
      proposalId: 1,
    });

    expect(restService).toBeCalledWith({
      endpoint: '/governance/proposals/votes',
      method: 'GET',
      params: {
        support: undefined,
        limit: 50,
        offset: undefined,
        proposalId: 1,
      },
    });

    expect(response).toMatchSnapshot();
  });
});
