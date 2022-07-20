import { VError } from 'errors';
import { Transaction, TransactionEvent } from 'types';
import { restService } from 'utilities';

import formatTransaction from './formatTransaction';
import { TransactionResponse } from './types';

export interface GetTransactionsInput {
  page?: number;
  event?: TransactionEvent;
  address?: string;
  sort?: 'desc' | 'asc';
  order?:
    | 'id'
    | 'event'
    | 'transactionHash'
    | 'blockNumber'
    | 'from'
    | 'to'
    | 'amount'
    | 'createdAt';
}

export interface GetTransactionsResponse {
  limit: number;
  page: number;
  total: number;
  result: TransactionResponse[];
}

export interface GetTransactionsOutput {
  limit: number;
  page: number;
  total: number;
  transactions: Transaction[];
}

const getTransactions = async ({
  page = 0,
  event,
  address,
  order = 'blockNumber',
  sort = 'desc',
}: GetTransactionsInput): Promise<GetTransactionsOutput> => {
  const response = await restService<GetTransactionsResponse>({
    endpoint: '/transactions',
    method: 'GET',
    params: {
      page,
      event,
      address,
      order,
      sort,
      version: 'v2',
    },
  });
  const payload = response.data?.data;
  // @todo Add specific api error handling
  if ('result' in response && response.result === 'error') {
    throw new VError({
      type: 'unexpected',
      code: 'somethingWentWrong',
      data: { message: response.message },
    });
  }

  if (!payload) {
    throw new VError({ type: 'unexpected', code: 'somethingWentWrongRetrievingTransactions' });
  }
  const { limit, page: payloadPage, total } = payload;
  const transactions = payload.result.map(data => formatTransaction(data));
  return { limit, page: payloadPage, total, transactions };
};

export default getTransactions;
