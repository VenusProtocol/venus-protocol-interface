import { VError } from 'errors';
import { restService } from 'utilities';

import votersResponse from '__mocks__/api/voters.json';

import getVoters from '.';

jest.mock('utilities/restService');

describe('api/queries/getVoters', () => {
  test('throws an error when request fails', async () => {
    const fakeErrorMessage = 'Fake error message';

    (restService as jest.Mock).mockImplementationOnce(async () => ({
      result: 'error',
      status: false,
      message: fakeErrorMessage,
    }));

    try {
      await getVoters({ id: 0 });

      throw new Error('getVoters should have thrown an error but did not');
    } catch (error) {
      expect(error).toBeInstanceOf(VError);
      if (error instanceof VError) {
        expect(error.type).toBe('unexpected');
        expect(error.code).toBe('somethingWentWrong');
        expect(error.message).toBe('somethingWentWrong');
        expect(error.data.message).toBe(fakeErrorMessage);
      }
    }
  });

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
