import Vi from 'vitest';

import proposalResponse from '__mocks__/api/proposals.json';

import { restService } from 'utilities';

import getProposal from './getProposal';

vi.mock('utilities/restService');

describe('api/queries/getProposal', () => {
  test('returns proposal', async () => {
    (restService as Vi.Mock).mockImplementationOnce(async () => ({
      status: 200,
      data: proposalResponse.result[0],
    }));

    const response = await getProposal({
      proposalId: 1,
      accountAddress: undefined,
    });

    expect(restService).toBeCalledWith({
      endpoint: '/governance/proposals/1',
      method: 'GET',
    });

    expect(response).toMatchSnapshot();
  });
});
