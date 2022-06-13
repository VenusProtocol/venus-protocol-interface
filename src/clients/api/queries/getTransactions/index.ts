import { restService } from 'utilities';
import { ITransaction, TransactionEvent } from 'types';
import { ITransactionResponse } from './types';
import formatTransaction from './formatTransaction';

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
  if ('result' in response && response.result === 'error') {
    // @todo Add specific api error handling
    throw new Error(response.message);
  }
  if (!payload) {
    // @todo Add specific api error handling
    throw new Error('Unexpected error retrieving transactions');
  }
  const { limit, page: payloadPage, total } = payload;
  const transactions = payload.result.map(data => formatTransaction(data));
  return { limit, page: payloadPage, total, transactions };
};

export default getTransactions;
