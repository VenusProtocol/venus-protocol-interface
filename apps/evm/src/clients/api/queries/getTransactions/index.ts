import { VError } from 'packages/errors';
import { Token, Transaction, TransactionEvent, VToken } from 'types';
import { restService } from 'utilities';

import formatTransaction from './formatTransaction';
import { TransactionResponse } from './types';

export interface GetTransactionsInput {
  vTokens: VToken[];
  tokens: Token[];
  defaultToken: Token;
  page?: number;
  event?: TransactionEvent;
  from?: string;
  sort?: '+';
  order?:
    | 'id'
    | 'event'
    | 'transactionHash'
    | 'blockNumber'
    | 'from'
    | 'to'
    | 'amountMantissa'
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
  vTokens,
  tokens,
  defaultToken,
  page = 0,
  event,
  from,
  order,
  sort,
}: GetTransactionsInput): Promise<GetTransactionsOutput> => {
  const orderWithSort = sort && order ? sort + order : order;
  const response = await restService<GetTransactionsResponse>({
    endpoint: '/activity/transactions',
    method: 'GET',
    params: {
      page,
      event,
      from,
      order: orderWithSort,
    },
  });
  const payload = response.data;
  // @todo Add specific api error handling
  if (payload && 'error' in payload) {
    throw new VError({
      type: 'unexpected',
      code: 'somethingWentWrong',
      data: { message: payload.error },
    });
  }

  if (!payload) {
    throw new VError({ type: 'unexpected', code: 'somethingWentWrongRetrievingTransactions' });
  }
  const { limit, page: payloadPage, total } = payload;
  const transactions = payload.result.map(data =>
    formatTransaction({ data, vTokens, defaultToken, tokens }),
  );

  return { limit, page: payloadPage, total, transactions };
};

export default getTransactions;
