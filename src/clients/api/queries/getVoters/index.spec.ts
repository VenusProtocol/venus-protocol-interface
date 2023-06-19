import { restService } from 'utilities';
import Vi from 'vitest';

import votersResponse from '__mocks__/api/voters.json';

import getVoters from '.';

vi.mock('utilities/restService');

describe('api/queries/getVoters', () => {
  test('returns proposal', async () => {
    (restService as Vi.Mock).mockImplementationOnce(async () => ({
      status: 200,
      data: votersResponse,
    }));

    const response = await getVoters({
      id: 1,
    });

    expect(restService).toBeCalledWith({
      endpoint: '/voters/1',
      method: 'GET',
      params: {
        filter: undefined,
        limit: undefined,
        offset: undefined,
      },
    });

    expect(response).toMatchSnapshot();
  });
});
