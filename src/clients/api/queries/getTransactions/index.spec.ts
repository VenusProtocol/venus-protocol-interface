import { VError } from 'errors';
import { restService } from 'utilities';

import fakeAddress from '__mocks__/models/address';
import { transactionResponse } from '__mocks__/models/transactions';

import getTransactions from '.';

jest.mock('utilities/restService');

describe('api/queries/getTransactions', () => {
  test('throws an error when request fails', async () => {
    const fakeErrorMessage = 'Fake error message';

    (restService as jest.Mock).mockImplementationOnce(async () => ({
      result: 'error',
      status: false,
      message: fakeErrorMessage,
    }));

    try {
      await getTransactions({});

      throw new Error('getTransactions should have thrown an error but did not');
    } catch (error) {
      expect(error).toBeInstanceOf(VError);
      if (error instanceof VError) {
        expect(error.type).toBe('unexpected');
        expect(error.data.message).toBe('Fake error message');
      }
    }
  });

  test('returns transaction models', async () => {
    (restService as jest.Mock).mockImplementationOnce(async () => ({
      status: 200,
      data: { data: { result: transactionResponse }, limit: 20, page: 1, total: 40 },
    }));

    const { transactions } = await getTransactions({
      page: 2,
      event: 'Withdraw',
      order: 'event',
      address: fakeAddress,
      sort: 'asc',
    });

    expect(transactions).toHaveLength(20);

    expect(restService).toBeCalledWith({
      endpoint: '/transactions',
      method: 'GET',
      params: {
        page: 2,
        event: 'Withdraw',
        order: 'event',
        address: fakeAddress,
        sort: 'asc',
        version: 'v2',
      },
    });

    expect(transactions).toMatchSnapshot();
  });

  test('Gets called with correct default arguments', async () => {
    (restService as jest.Mock).mockImplementationOnce(async () => ({
      status: 200,
      data: { data: { result: transactionResponse }, limit: 20, page: 1, total: 40 },
    }));

    const { transactions } = await getTransactions({});

    expect(transactions).toHaveLength(20);

    expect(restService).toBeCalledWith({
      endpoint: '/transactions',
      method: 'GET',
      params: {
        page: 0,
        event: undefined,
        order: 'blockNumber',
        address: undefined,
        sort: 'desc',
        version: 'v2',
      },
    });

    expect(transactions).toMatchSnapshot();
  });
});
