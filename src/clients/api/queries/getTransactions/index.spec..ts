import { restService } from 'utilities/restService';
import { transactionResponse } from '__mocks__/models/transactions';
import fakeAddress from '__mocks__/models/address';
import getTransactions from '.';

jest.mock('utilities/restService');

describe('api/queries/getMarkets', () => {
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
      expect(error).toMatchInlineSnapshot('[Error: Fake error message]');
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
        page: 1,
        event: undefined,
        order: 'blockNumber',
        address: undefined,
        sort: 'desc',
      },
    });

    expect(transactions).toMatchSnapshot();
  });
});
