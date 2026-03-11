import { type QueryObserverOptions, useQuery } from '@tanstack/react-query';

import FunctionKey from 'constants/functionKey';
import { useChainId } from 'libs/wallet';
import type { ChainId } from 'types';

import type { YieldPlusTransaction } from './types';

export interface GetYieldPlusTransactionsInput {
  accountAddress?: string;
}

export interface GetYieldPlusTransactionsOutput {
  transactions: YieldPlusTransaction[];
}

const getYieldPlusTransactions = async (
  _input: GetYieldPlusTransactionsInput,
): Promise<GetYieldPlusTransactionsOutput> => {
  // Mock: returns empty transactions
  return { transactions: [] };
};

type UseGetYieldPlusTransactionsQueryKey = [
  FunctionKey.GET_YIELD_PLUS_TRANSACTIONS,
  { chainId: ChainId; accountAddress: string },
];

type Options = QueryObserverOptions<
  GetYieldPlusTransactionsOutput,
  Error,
  GetYieldPlusTransactionsOutput,
  GetYieldPlusTransactionsOutput,
  UseGetYieldPlusTransactionsQueryKey
>;

export const useGetYieldPlusTransactions = (
  input: GetYieldPlusTransactionsInput,
  options?: Partial<Options>,
) => {
  const { chainId } = useChainId();

  return useQuery({
    queryKey: [
      FunctionKey.GET_YIELD_PLUS_TRANSACTIONS,
      { chainId, accountAddress: input.accountAddress ?? '' },
    ],
    queryFn: () => getYieldPlusTransactions(input),
    ...options,
  });
};
