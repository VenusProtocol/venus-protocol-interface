import { restService } from 'utilities';
import { ITransactionResponse, TransactionEvent } from 'types';
import { Transaction } from 'models';

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
  result: Transaction[];
}

const getTransactions = async ({
  page = 1,
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
  const transactions = payload.result.map(data => new Transaction(data));
  return { ...payload, result: transactions };
};

export default getTransactions;
