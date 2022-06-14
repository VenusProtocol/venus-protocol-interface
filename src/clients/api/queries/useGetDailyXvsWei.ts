import { useQuery, QueryObserverOptions } from 'react-query';

import getDailyXvsWei, {
  IGetDailyXvsWeiInput,
  IGetDailyXvsWeiOutput,
} from 'clients/api/queries/getDailyXvsWei';
import { useVenusLensContract } from 'clients/contracts/hooks';
import FunctionKey from 'constants/functionKey';

type Options = QueryObserverOptions<
  IGetDailyXvsWeiOutput,
  Error,
  IGetDailyXvsWeiOutput,
  IGetDailyXvsWeiOutput,
  [FunctionKey.GET_V_TOKEN_DAILY_XVS_WEI, string]
>;

const useGetDailyXvsWei = (
  { accountAddress }: Omit<IGetDailyXvsWeiInput, 'venusLensContract'>,
  options?: Options,
) => {
  const venusLensContract = useVenusLensContract();
  return useQuery(
    [FunctionKey.GET_V_TOKEN_DAILY_XVS_WEI, accountAddress],
    () => getDailyXvsWei({ accountAddress, venusLensContract }),
    options,
  );
};
export default useGetDailyXvsWei;
