import type Vi from 'vitest';

import voteSummaryResponse from '__mocks__/api/voteSummary.json';

import { restService } from 'utilities';

import getVoteSummary from '.';

vi.mock('utilities/restService');

describe('api/queries/getVoteSummary', () => {
  test('returns summary of votes', async () => {
    (restService as Vi.Mock).mockImplementationOnce(async () => ({
      status: 200,
      data: voteSummaryResponse,
    }));

    const response = await getVoteSummary({
      proposalId: 1,
    });

    expect(restService).toBeCalledWith({
      endpoint: '/governance/proposals/1/voteSummary',
      method: 'GET',
    });

    expect(response).toMatchSnapshot();
  });
});
