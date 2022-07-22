import { QueryObserverOptions, useQuery } from 'react-query';

import getDailyXvsWei, {
  GetDailyXvsWeiInput,
  IGetDailyXvsWeiOutput,
} from 'clients/api/queries/getDailyXvsWei';
import { useVenusLensContract } from 'clients/contracts/hooks';
import FunctionKey from 'constants/functionKey';

type Options = QueryObserverOptions<
  IGetDailyXvsWeiOutput,
  Error,
  IGetDailyXvsWeiOutput,
  IGetDailyXvsWeiOutput,
  [FunctionKey.GET_V_TOKEN_DAILY_XVS_WEI, Omit<GetDailyXvsWeiInput, 'venusLensContract'>]
>;

const useGetDailyXvsWei = (
  params: Omit<GetDailyXvsWeiInput, 'venusLensContract'>,
  options?: Options,
) => {
  const venusLensContract = useVenusLensContract();

  return useQuery(
    [FunctionKey.GET_V_TOKEN_DAILY_XVS_WEI, params],
    () => getDailyXvsWei({ accountAddress: params.accountAddress, venusLensContract }),
    options,
  );
};
export default useGetDailyXvsWei;
