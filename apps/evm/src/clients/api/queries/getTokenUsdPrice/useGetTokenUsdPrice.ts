import { type QueryObserverOptions, useQuery } from '@tanstack/react-query';

import type { ChainId } from '@venusprotocol/chains';
import {
  type GetTokenUsdPriceInput,
  type GetTokenUsdPriceOutput,
  getTokenUsdPrice,
} from 'clients/api';
import FunctionKey from 'constants/functionKey';
import { useGetResilientOracleContract } from 'libs/contracts';
import { useChainId } from 'libs/wallet';
import type { Token } from 'types';
import { callOrThrow } from 'utilities';

type TrimmedGetTokenUsdPriceInput = Omit<GetTokenUsdPriceInput, 'resilientOracleContract'>;

export type UseGetTokenBalancesQueryKey = [
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
  UseGetTokenBalancesQueryKey
>;

interface UseGetTokenUsdPriceInput extends Omit<TrimmedGetTokenUsdPriceInput, 'token'> {
  token?: Token;
}

const useGetTokenUsdPrice = ({ token }: UseGetTokenUsdPriceInput, options?: Partial<Options>) => {
  const { chainId } = useChainId();
  const resilientOracleContract = useGetResilientOracleContract({
    chainId,
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
      callOrThrow({ token, resilientOracleContract }, params => getTokenUsdPrice({ ...params })),

    ...options,
    enabled: (options?.enabled === undefined || options?.enabled) && !!token,
  });
};

export default useGetTokenUsdPrice;
