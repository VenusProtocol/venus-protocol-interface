import { useQuery, QueryObserverOptions } from 'react-query';

import getVTokenDailyXvsWei, {
  IGetVTokenDailyXvsWeiInput,
  IGetVTokenDailyXvsWeiOutput,
} from 'clients/api/queries/getVTokenDailyXvsWei';
import { useVenusLensContract } from 'clients/contracts/hooks';
import FunctionKey from 'constants/functionKey';

type Options = QueryObserverOptions<
  IGetVTokenDailyXvsWeiOutput,
  Error,
  IGetVTokenDailyXvsWeiOutput,
  IGetVTokenDailyXvsWeiOutput,
  [FunctionKey.GET_V_TOKEN_DAILY_XVS_WEI, string]
>;

const useGetVTokenDailyXvsWei = (
  { accountAddress }: Omit<IGetVTokenDailyXvsWeiInput, 'venusLensContract'>,
  options?: Options,
) => {
  const venusLensContract = useVenusLensContract();
  return useQuery(
    [FunctionKey.GET_V_TOKEN_DAILY_XVS_WEI, accountAddress],
    () => getVTokenDailyXvsWei({ accountAddress, venusLensContract }),
    options,
  );
};
export default useGetVTokenDailyXvsWei;
