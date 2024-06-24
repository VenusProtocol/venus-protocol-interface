import { type QueryObserverOptions, useQuery } from 'react-query';

import getApiMarkets, { type GetApiMarketsOutput } from 'clients/api/queries/getApiMarkets';
import FunctionKey from 'constants/functionKey';
import { useGetToken } from 'libs/tokens';
import { callOrThrow } from 'utilities';

type Options = QueryObserverOptions<
  GetApiMarketsOutput,
  Error,
  GetApiMarketsOutput,
  GetApiMarketsOutput,
  FunctionKey.GET_MARKETS
>;

const useGetApiMarkets = (options?: Options) => {
  const xvs = useGetToken({
    symbol: 'XVS',
  });

  return useQuery(FunctionKey.GET_MARKETS, () => callOrThrow({ xvs }, getApiMarkets), options);
};

export default useGetApiMarkets;
