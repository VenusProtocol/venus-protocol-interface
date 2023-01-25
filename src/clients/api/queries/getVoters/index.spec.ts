import { VError } from 'errors';
import { restService } from 'utilities';

import votersResponse from '__mocks__/api/voters.json';

import getVoters from '.';

jest.mock('utilities/restService');

describe('api/queries/getVoters', () => {
  test('returns proposal', async () => {
    (restService as jest.Mock).mockImplementationOnce(async () => ({
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
