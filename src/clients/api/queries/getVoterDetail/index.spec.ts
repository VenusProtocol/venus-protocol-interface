import { restService } from 'utilities';
import voterDetailResponse from '__mocks__/api/voterDetail.json';
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
      expect(error).toMatchInlineSnapshot('[Error: Fake error message]');
    }
  });

  test('returns  formatted voter details', async () => {
    (restService as jest.Mock).mockImplementationOnce(async () => ({
      status: 200,
      data: voterDetailResponse,
    }));

    const response = await getVoterDetail({ address: fakeAddress });

    expect(restService).toBeCalledWith({
      endpoint: `/voters/accounts/${fakeAddress}`,
      method: 'GET',
    });

    expect(response).toMatchSnapshot();
  });
});
