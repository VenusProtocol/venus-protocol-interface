import { type QueryObserverOptions, useQuery } from '@tanstack/react-query';

import getLegacyPoolMarkets, {
  type GetLegacyPoolMarketsOutput,
} from 'clients/api/queries/getLegacyPoolMarkets';
import FunctionKey from 'constants/functionKey';
import { useGetToken } from 'libs/tokens';
import { callOrThrow } from 'utilities';

type Options = QueryObserverOptions<
  GetLegacyPoolMarketsOutput,
  Error,
  GetLegacyPoolMarketsOutput,
  GetLegacyPoolMarketsOutput,
  [FunctionKey.GET_MAIN_MARKETS]
>;

const useGetLegacyPoolMarkets = (options?: Partial<Options>) => {
  const xvs = useGetToken({
    symbol: 'XVS',
  });

  return useQuery({
    queryKey: [FunctionKey.GET_MAIN_MARKETS],
    queryFn: () => callOrThrow({ xvs }, getLegacyPoolMarkets),
    ...options,
  });
};

export default useGetLegacyPoolMarkets;
