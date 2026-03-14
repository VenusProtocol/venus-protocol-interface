import { type QueryObserverOptions, useQuery } from '@tanstack/react-query';

import FunctionKey from 'constants/functionKey';
import { useGetContractAddress } from 'hooks/useGetContractAddress';
import { useChainId, usePublicClient } from 'libs/wallet';
import type { ChainId, Token } from 'types';
import { callOrThrow } from 'utilities';
import type { Address } from 'viem';
import {
  type GetTokenListUsdPriceInput,
  type GetTokenListUsdPriceOutput,
  getTokenListUsdPrice,
} from '.';

type TrimmedGetTokenListUsdPriceInput = Omit<
  GetTokenListUsdPriceInput,
  'publicClient' | 'resilientOracleAddress'
>;

export type UseGetTokenListUsdPriceQueryKey = [
  FunctionKey.GET_TOKEN_USD_PRICE,
  Array<{ tokenAddress: Address; chainId: ChainId }> | undefined,
];

type Options = QueryObserverOptions<
  GetTokenListUsdPriceOutput,
  Error,
  GetTokenListUsdPriceOutput,
  GetTokenListUsdPriceOutput,
  UseGetTokenListUsdPriceQueryKey
>;

export interface UseGetTokenListUsdPriceInput
  extends Omit<TrimmedGetTokenListUsdPriceInput, 'tokens'> {
  tokens: Token[];
}

export const useGetTokenListUsdPrice = (
  { tokens }: UseGetTokenListUsdPriceInput,
  options?: Partial<Options>,
) => {
  const { chainId } = useChainId();
  const { publicClient } = usePublicClient();
  const { address: resilientOracleAddress } = useGetContractAddress({
    name: 'ResilientOracle',
  });

  return useQuery({
    queryKey: [
      FunctionKey.GET_TOKEN_USD_PRICE,
      tokens?.map(token => ({
        tokenAddress: token.address,
        chainId,
      })),
    ],

    queryFn: () =>
      callOrThrow({ tokens, resilientOracleAddress }, params =>
        getTokenListUsdPrice({ publicClient, ...params }),
      ),

    ...options,
    enabled: (options?.enabled === undefined || options?.enabled) && Array.isArray(tokens),
  });
};
