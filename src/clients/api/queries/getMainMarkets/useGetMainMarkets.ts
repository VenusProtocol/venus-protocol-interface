import { useGetToken } from 'packages/tokens';
import { QueryObserverOptions, useQuery } from 'react-query';
import { callOrThrow } from 'utilities';

import getMainMarkets, { GetMainMarketsOutput } from 'clients/api/queries/getMainMarkets';
import FunctionKey from 'constants/functionKey';

type Options = QueryObserverOptions<
  GetMainMarketsOutput,
  Error,
  GetMainMarketsOutput,
  GetMainMarketsOutput,
  FunctionKey.GET_MAIN_MARKETS
>;

const useGetMainMarkets = (options?: Options) => {
  const xvs = useGetToken({
    symbol: 'XVS',
  });

  return useQuery(
    FunctionKey.GET_MAIN_MARKETS,
    () => callOrThrow({ xvs }, getMainMarkets),
    options,
  );
};

export default useGetMainMarkets;
