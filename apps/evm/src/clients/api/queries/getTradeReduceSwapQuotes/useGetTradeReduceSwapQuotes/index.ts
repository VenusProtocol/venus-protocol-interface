import { type QueryObserverOptions, useQuery } from '@tanstack/react-query';

import {
  type GetTradeReduceSwapQuotesInput,
  type GetTradeReduceSwapQuotesOutput,
  getTradeReduceSwapQuotes,
} from 'clients/api/queries/getTradeReduceSwapQuotes';
import FunctionKey from 'constants/functionKey';
import { useGetContractAddress } from 'hooks/useGetContractAddress';
import { useChainId } from 'libs/wallet';
import { isEqual } from 'lodash-es';
import type { ChainId, SwapQuoteError } from 'types';
import callOrThrow from 'utilities/callOrThrow';
import { generatePseudoRandomRefetchInterval } from 'utilities/generatePseudoRandomRefetchInterval';

type TrimmedGetTradeReduceSwapQuotesInput = Omit<
  GetTradeReduceSwapQuotesInput,
  'chainId' | 'leverageManagerContractAddress' | 'relativePositionManagerContractAddress'
>;

type QueryKey = [
  FunctionKey.GET_TRADE_REDUCE_SWAP_QUOTES,
  TrimmedGetTradeReduceSwapQuotesInput & {
    chainId: ChainId;
  },
];

type Options = QueryObserverOptions<
  GetTradeReduceSwapQuotesOutput,
  SwapQuoteError,
  GetTradeReduceSwapQuotesOutput,
  GetTradeReduceSwapQuotesOutput,
  QueryKey
>;

const refetchInterval = generatePseudoRandomRefetchInterval('fast');

export const useGetTradeReduceSwapQuotes = (
  input: TrimmedGetTradeReduceSwapQuotesInput,
  options?: Partial<Options>,
) => {
  const { chainId } = useChainId();
  const { address: relativePositionManagerContractAddress } = useGetContractAddress({
    name: 'RelativePositionManager',
  });

  const { address: leverageManagerContractAddress } = useGetContractAddress({
    name: 'LeverageManager',
  });

  const queryKey: QueryKey = [FunctionKey.GET_TRADE_REDUCE_SWAP_QUOTES, { ...input, chainId }];

  return useQuery({
    queryKey,
    queryFn: () =>
      callOrThrow(
        { relativePositionManagerContractAddress, leverageManagerContractAddress },
        params =>
          getTradeReduceSwapQuotes({
            chainId,
            ...params,
            ...input,
          }),
      ),
    placeholderData: (previousData, previousQuery) => {
      if (!previousQuery) {
        return undefined;
      }

      // Keep previous data if reduce swaps are being refetched for the same position
      const {
        shortAmountToRepayTokens: _1,
        longAmountToWithdrawTokens: _2,
        ...trimmedQueryParams
      } = queryKey[1];

      const {
        shortAmountToRepayTokens: _3,
        longAmountToWithdrawTokens: _4,
        ...trimmedPreviousQueryParams
      } = previousQuery.queryKey[1];

      return isEqual(trimmedQueryParams, trimmedPreviousQueryParams) ? previousData : undefined;
    },
    refetchInterval,
    ...options,
  });
};
