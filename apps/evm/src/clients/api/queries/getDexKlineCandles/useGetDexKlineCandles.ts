import { type QueryObserverOptions, useQuery } from '@tanstack/react-query';

import FunctionKey from 'constants/functionKey';
import { useChainId } from 'libs/wallet';
import { ChainId } from 'types';
import {
  type GetDexKlineCandlesInput,
  type GetDexKlineCandlesOutput,
  getDexKlineCandles,
} from '.';

// Platform names as defined by the DEX API
const DEX_PLATFORM_BY_CHAIN_ID = new Map<ChainId, string>([
  [ChainId.ETHEREUM, 'ethereum'],
  [ChainId.SEPOLIA, 'ethereum'],
  [ChainId.BSC_MAINNET, 'bsc'],
  [ChainId.BSC_TESTNET, 'bsc'],
  [ChainId.BASE_MAINNET, 'base'],
  [ChainId.BASE_SEPOLIA, 'base'],
]);

type TrimmedGetDexKlineCandlesInput = Omit<GetDexKlineCandlesInput, 'platform'>;

export type UseGetDexKlineCandlesQueryKey = [
  FunctionKey.GET_DEX_KLINE_CANDLES,
  TrimmedGetDexKlineCandlesInput & { chainId: ChainId },
];

type Options = QueryObserverOptions<
  GetDexKlineCandlesOutput,
  Error,
  GetDexKlineCandlesOutput,
  GetDexKlineCandlesOutput,
  UseGetDexKlineCandlesQueryKey
>;

export const useGetDexKlineCandles = (
  params: TrimmedGetDexKlineCandlesInput,
  options?: Partial<Options>,
) => {
  const { chainId } = useChainId();
  const platform = DEX_PLATFORM_BY_CHAIN_ID.get(chainId);

  return useQuery({
    queryKey: [FunctionKey.GET_DEX_KLINE_CANDLES, { ...params, chainId }],
    queryFn: () => getDexKlineCandles({ platform: platform!, ...params }),
    staleTime: Number.POSITIVE_INFINITY,
    enabled: !!platform,
    ...options,
  });
};
