import { VError } from 'errors';
import { restService } from 'utilities';

import voterHistoryResponse from '__mocks__/api/voterHistory.json';
import fakeAddress from '__mocks__/models/address';

import getVoterHistory from '.';

jest.mock('utilities/restService');

describe('api/queries/getVoterHistory', () => {
  test('throws an error when request fails', async () => {
    const fakeErrorMessage = 'Fake error message';

    (restService as jest.Mock).mockImplementationOnce(async () => ({
      result: 'error',
      status: false,
      message: fakeErrorMessage,
    }));

    try {
      await getVoterHistory({ address: fakeAddress });

      throw new Error('getVoterHistory should have thrown an error but did not');
    } catch (error) {
      expect(error).toBeInstanceOf(VError);
      if (error instanceof VError) {
        expect(error.type).toBe('unexpected');
        expect(error.data.message).toBe('Fake error message');
      }
    }
  });

  test('returns formatted voter history', async () => {
    (restService as jest.Mock).mockImplementationOnce(async () => ({
      status: 200,
      data: voterHistoryResponse,
    }));

    const payload = await getVoterHistory({
      page: 2,
      address: fakeAddress,
    });

    expect(restService).toBeCalledWith({
      endpoint: `/voters/history/${fakeAddress}`,
      method: 'GET',
      params: {
        limit: 6,
        offset: 12,
        version: 'v2',
      },
    });

    expect(payload).toMatchSnapshot();
  });

  test('Gets called with correct default arguments', async () => {
    (restService as jest.Mock).mockImplementationOnce(async () => ({
      status: 200,
      data: voterHistoryResponse,
    }));

    const payload = await getVoterHistory({ address: fakeAddress });

    expect(payload.voterHistory).toHaveLength(5);

    expect(restService).toBeCalledWith({
      endpoint: `/voters/history/${fakeAddress}`,
      method: 'GET',
      params: {
        limit: 6,
        offset: 0,
        version: 'v2',
      },
    });

    expect(payload).toMatchSnapshot();
  });
});
