import { VError } from 'errors';
import { restService } from 'utilities';

import voterDetailsResponse from '__mocks__/api/voterDetails.json';
import fakeAddress from '__mocks__/models/address';

import getVoterDetail from '.';

jest.mock('utilities/restService');

describe('api/queries/getVoterDetail', () => {
  test('throws an error when request fails', async () => {
    const fakeErrorMessage = 'Fake error message';

    (restService as jest.Mock).mockImplementationOnce(async () => ({
      result: 'error',
      status: false,
      message: fakeErrorMessage,
    }));

    try {
      await getVoterDetail({ address: fakeAddress });

      throw new Error('getVoterDetail should have thrown an error but did not');
    } catch (error) {
      expect(error).toBeInstanceOf(VError);
      if (error instanceof VError) {
        expect(error.type).toBe('unexpected');
        expect(error.data.message).toBe('Fake error message');
      }
    }
  });

  test('returns  formatted voter details', async () => {
    (restService as jest.Mock).mockImplementationOnce(async () => ({
      status: 200,
      data: voterDetailsResponse,
    }));

    const response = await getVoterDetail({ address: fakeAddress });

    expect(restService).toBeCalledWith({
      endpoint: `/voters/accounts/${fakeAddress}`,
      method: 'GET',
    });

    expect(response).toMatchSnapshot();
  });
});
