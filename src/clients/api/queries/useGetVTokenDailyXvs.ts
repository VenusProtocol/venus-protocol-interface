import { useQuery, QueryObserverOptions } from 'react-query';

import getVTokenDailyXvs, {
  IGetVTokenDailyXvsInput,
  IGetVTokenDailyXvsOutput,
} from 'clients/api/queries/getVTokenDailyXvs';
import { useVenusLensContract } from 'clients/contracts/hooks';
import FunctionKey from 'constants/functionKey';

type Options = QueryObserverOptions<
  IGetVTokenDailyXvsOutput,
  Error,
  IGetVTokenDailyXvsOutput,
  IGetVTokenDailyXvsOutput,
  [FunctionKey.GET_V_TOKEN_DAILY_XVS, string]
>;

const vTokenDailyXvsWei = (
  { account }: Omit<IGetVTokenDailyXvsInput, 'venusLensContract'>,
  options?: Options,
) => {
  const venusLensContract = useVenusLensContract();
  return useQuery(
    [FunctionKey.GET_V_TOKEN_DAILY_XVS, account],
    () => getVTokenDailyXvs({ account, venusLensContract }),
    options,
  );
};
export default vTokenDailyXvsWei;
