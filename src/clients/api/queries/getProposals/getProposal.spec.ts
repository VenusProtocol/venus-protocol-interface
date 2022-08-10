import { VError } from 'errors';
import { restService } from 'utilities';

import proposalResponse from '__mocks__/api/proposals.json';

import getProposal from './getProposal';

jest.mock('utilities/restService');

describe('api/queries/getProposal', () => {
  test('throws an error when request fails', async () => {
    const fakeErrorMessage = 'Fake error message';

    (restService as jest.Mock).mockImplementationOnce(async () => ({
      result: 'error',
      status: false,
      message: fakeErrorMessage,
    }));

    try {
      await getProposal({ id: 0 });

      throw new Error('getProposal should have thrown an error but did not');
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
