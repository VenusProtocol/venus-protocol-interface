import { VError } from 'errors';
import { ITransaction, TransactionEvent } from 'types';
import { restService } from 'utilities';

import formatTransaction from './formatTransaction';
import { ITransactionResponse } from './types';

export interface IGetTransactionsInput {
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

export interface IGetTransactionsResponse {
  limit: number;
  page: number;
  total: number;
  result: ITransactionResponse[];
}

export interface IGetTransactionsOutput {
  limit: number;
  page: number;
  total: number;
  transactions: ITransaction[];
}

const getTransactions = async ({
  page = 0,
  event,
  address,
  order = 'blockNumber',
  sort = 'desc',
}: IGetTransactionsInput): Promise<IGetTransactionsOutput> => {
  const response = await restService<IGetTransactionsResponse>({
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
