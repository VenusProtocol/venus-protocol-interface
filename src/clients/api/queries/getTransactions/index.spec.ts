import { restService } from 'utilities';
import Vi from 'vitest';

import fakeAddress from '__mocks__/models/address';
import { transactionResponse } from '__mocks__/models/transactions';

import getTransactions from '.';

vi.mock('utilities/restService');

describe('api/queries/getTransactions', () => {
  test('returns transaction models', async () => {
    (restService as Vi.Mock).mockImplementationOnce(async () => ({
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
    (restService as Vi.Mock).mockImplementationOnce(async () => ({
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
