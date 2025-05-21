import { type QueryObserverOptions, useQuery } from '@tanstack/react-query';

import {
  type GetTokenUsdPriceInput,
  type GetTokenUsdPriceOutput,
  getTokenUsdPrice,
} from 'clients/api';
import FunctionKey from 'constants/functionKey';
import { useGetContractAddress } from 'hooks/useGetContractAddress';
import { usePublicClient } from 'libs/wallet';
import { useChainId } from 'libs/wallet';
import type { ChainId, Token } from 'types';
import { callOrThrow } from 'utilities';

type TrimmedGetTokenUsdPriceInput = Omit<
  GetTokenUsdPriceInput,
  'publicClient' | 'resilientOracleAddress'
>;

export type UseGetTokenUsdPriceQueryKey = [
  FunctionKey.GET_TOKEN_USD_PRICE,
  {
    tokenAddress: string;
    chainId: ChainId;
  },
];

type Options = QueryObserverOptions<
  GetTokenUsdPriceOutput,
  Error,
  GetTokenUsdPriceOutput,
  GetTokenUsdPriceOutput,
  UseGetTokenUsdPriceQueryKey
>;

export interface UseGetTokenUsdPriceInput extends Omit<TrimmedGetTokenUsdPriceInput, 'token'> {
  token?: Token;
}

export const useGetTokenUsdPrice = (
  { token }: UseGetTokenUsdPriceInput,
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
      {
        tokenAddress: token ? token.address : '',
        chainId,
      },
    ],

    queryFn: () =>
      callOrThrow({ token, resilientOracleAddress }, params =>
        getTokenUsdPrice({ publicClient, ...params }),
      ),

    ...options,
    enabled: (options?.enabled === undefined || options?.enabled) && !!token,
  });
};
