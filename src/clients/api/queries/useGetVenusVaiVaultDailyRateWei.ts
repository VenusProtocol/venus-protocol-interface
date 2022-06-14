import { useQuery, QueryObserverOptions } from 'react-query';

import { getVenusVaiVaultDailyRateWei, GetVenusVaiVaultDailyRateWeiOutput } from 'clients/api';
import FunctionKey from 'constants/functionKey';
import { useComptrollerContract } from 'clients/contracts/hooks';

type Options = QueryObserverOptions<
  GetVenusVaiVaultDailyRateWeiOutput,
  Error,
  GetVenusVaiVaultDailyRateWeiOutput,
  GetVenusVaiVaultDailyRateWeiOutput,
  FunctionKey.GET_VENUS_VAI_VAULT_DAILY_RATE_WEI
>;

const useGetVenusVaiVaultDailyRateWei = (options?: Options) => {
  const comptrollerContract = useComptrollerContract();

  return useQuery(
    FunctionKey.GET_VENUS_VAI_VAULT_DAILY_RATE_WEI,
    () => getVenusVaiVaultDailyRateWei({ comptrollerContract }),
    options,
  );
};

export default useGetVenusVaiVaultDailyRateWei;
