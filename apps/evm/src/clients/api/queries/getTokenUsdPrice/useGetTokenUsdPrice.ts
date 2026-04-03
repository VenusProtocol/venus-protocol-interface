import { type QueryObserverOptions, useQuery } from '@tanstack/react-query';
import BigNumber from 'bignumber.js';

import {
  type GetTokenUsdPriceInput,
  type GetTokenUsdPriceOutput,
  getTokenUsdPrice,
} from 'clients/api';
import { NULL_ADDRESS } from 'constants/address';
import FunctionKey from 'constants/functionKey';
import { useGetContractAddress } from 'hooks/useGetContractAddress';
import { useGetToken } from 'libs/tokens';
import { useChainId, usePublicClient } from 'libs/wallet';
import type { ChainId, Token } from 'types';
import { callOrThrow } from 'utilities';
import { checkIsXvsOnZk } from 'utilities/xvsPriceOnZk';
import { XVS_FIXED_PRICE_CENTS } from 'utilities/xvsPriceOnZk/constants';
import type { Address } from 'viem';

type TrimmedGetTokenUsdPriceInput = Omit<
  GetTokenUsdPriceInput,
  'publicClient' | 'resilientOracleAddress'
>;

export type UseGetTokenUsdPriceQueryKey = [
  FunctionKey.GET_TOKEN_USD_PRICE,
  {
    tokenAddress: Address;
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

  const xvs = useGetToken({
    symbol: 'XVS',
  });
  const isXvsOnZk = checkIsXvsOnZk({
    chainId,
    token,
    xvs,
  });

  return useQuery({
    queryKey: [
      FunctionKey.GET_TOKEN_USD_PRICE,
      {
        tokenAddress: token?.address ?? NULL_ADDRESS,
        chainId,
      },
    ],

    queryFn: () =>
      callOrThrow({ token, resilientOracleAddress }, params =>
        getTokenUsdPrice({ publicClient, ...params }),
      ),

    ...options,
    ...(isXvsOnZk
      ? {
          initialData: {
            tokenPriceUsd: new BigNumber(XVS_FIXED_PRICE_CENTS).shiftedBy(-2),
          },
          staleTime: Number.POSITIVE_INFINITY,
        }
      : {}),
    enabled: (options?.enabled === undefined || options?.enabled) && !!token,
  });
};
