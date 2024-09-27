import { type QueryObserverOptions, useQuery } from '@tanstack/react-query';

import getApiMarkets, {
  type GetApiMarketsInput,
  type GetApiMarketsOutput,
} from 'clients/api/queries/getApiMarkets';
import FunctionKey from 'constants/functionKey';
import { useGetToken } from 'libs/tokens';
import { useChainId } from 'libs/wallet';
import { callOrThrow } from 'utilities';

type TrimmedGetMarketsInput = Omit<GetApiMarketsInput, 'xvs'>;

export type UseGetMarketsQueryKey = [FunctionKey.GET_MARKETS, TrimmedGetMarketsInput];

type Options = QueryObserverOptions<
  GetApiMarketsOutput,
  Error,
  GetApiMarketsOutput,
  GetApiMarketsOutput,
  UseGetMarketsQueryKey
>;

const useGetApiMarkets = (options?: Options) => {
  const { chainId } = useChainId();
  const xvs = useGetToken({
    symbol: 'XVS',
  });

  return useQuery({
    queryKey: [FunctionKey.GET_MARKETS, { chainId }],
    queryFn: () => callOrThrow({ xvs }, params => getApiMarkets({ ...params, chainId })),
    ...options,
  });
};

export default useGetApiMarkets;
