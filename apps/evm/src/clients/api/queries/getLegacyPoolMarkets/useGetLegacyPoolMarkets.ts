import { QueryObserverOptions, useQuery } from 'react-query';

import getLegacyPoolMarkets, {
  GetLegacyPoolMarketsOutput,
} from 'clients/api/queries/getLegacyPoolMarkets';
import FunctionKey from 'constants/functionKey';
import { useGetToken } from 'libs/tokens';
import { callOrThrow } from 'utilities';

type Options = QueryObserverOptions<
  GetLegacyPoolMarketsOutput,
  Error,
  GetLegacyPoolMarketsOutput,
  GetLegacyPoolMarketsOutput,
  FunctionKey.GET_MAIN_MARKETS
>;

const useGetLegacyPoolMarkets = (options?: Options) => {
  const xvs = useGetToken({
    symbol: 'XVS',
  });

  return useQuery(
    FunctionKey.GET_MAIN_MARKETS,
    () => callOrThrow({ xvs }, getLegacyPoolMarkets),
    options,
  );
};

export default useGetLegacyPoolMarkets;
