import { restService } from 'utilities/restService';
import requestFaucetFunds from './requestFaucetFunds';

jest.mock('utilities/restService');

describe('api/mutations/requestFaucetFunds', () => {
  test('throws an error when request fails', async () => {
    const fakeErrorMessage = 'Fake error message';

    (restService as jest.Mock).mockImplementationOnce(async () => ({
      result: 'error',
      status: false,
      message: fakeErrorMessage,
    }));

    try {
      await requestFaucetFunds({
        address: 'fake address',
        asset: 'bnb',
        amountType: 'low',
      });

      throw new Error('requestFaucetFunds should have thrown an error but did not');
    } catch (error) {
      expect(error).toMatchInlineSnapshot('[Error: Fake error message]');
    }
  });

  test('returns undefined when request succeeds', async () => {
    (restService as jest.Mock).mockImplementationOnce(async () => ({
      status: 200,
    }));

    const response = await requestFaucetFunds({
      address: 'fake address',
      asset: 'bnb',
      amountType: 'low',
    });

    expect(response).toBe(undefined);
  });
});
