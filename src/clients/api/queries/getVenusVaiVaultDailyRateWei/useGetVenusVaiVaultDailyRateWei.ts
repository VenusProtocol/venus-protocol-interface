import { QueryObserverOptions, useQuery } from 'react-query';

import { GetVenusVaiVaultDailyRateWeiOutput, getVenusVaiVaultDailyRateWei } from 'clients/api';
import { useComptrollerContract } from 'clients/contracts/hooks';
import FunctionKey from 'constants/functionKey';

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
