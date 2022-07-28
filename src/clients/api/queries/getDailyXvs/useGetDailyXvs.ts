import { QueryObserverOptions, useQuery } from 'react-query';

import getDailyXvs, { GetDailyXvsInput, IGetDailyXvsOutput } from 'clients/api/queries/getDailyXvs';
import { useVenusLensContract } from 'clients/contracts/hooks';
import FunctionKey from 'constants/functionKey';

type Options = QueryObserverOptions<
  IGetDailyXvsOutput,
  Error,
  IGetDailyXvsOutput,
  IGetDailyXvsOutput,
  [FunctionKey.GET_V_TOKEN_DAILY_XVS, Omit<GetDailyXvsInput, 'venusLensContract'>]
>;

const useGetDailyXvs = (params: Omit<GetDailyXvsInput, 'venusLensContract'>, options?: Options) => {
  const venusLensContract = useVenusLensContract();

  return useQuery(
    [FunctionKey.GET_V_TOKEN_DAILY_XVS, params],
    () => getDailyXvs({ accountAddress: params.accountAddress, venusLensContract }),
    options,
  );
};
export default useGetDailyXvs;
