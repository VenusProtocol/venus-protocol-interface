import { restService } from 'utilities';
import Vi from 'vitest';

import proposalResponse from '__mocks__/api/proposals.json';

import getProposal from './getProposal';

vi.mock('utilities/restService');

describe('api/queries/getProposal', () => {
  test('returns proposal', async () => {
    (restService as Vi.Mock).mockImplementationOnce(async () => ({
      status: 200,
      data: { data: proposalResponse.result[0] },
    }));

    const response = await getProposal({
      id: 1,
    });

    expect(restService).toBeCalledWith({
      endpoint: '/proposals/1',
      method: 'GET',
      params: {
        version: 'v2',
      },
    });

    expect(response).toMatchSnapshot();
  });
});
