import { QueryObserverOptions, useQuery } from 'react-query';

import { GetVenusVaiVaultDailyRateOutput, getVenusVaiVaultDailyRate } from 'clients/api';
import { useComptrollerContract } from 'clients/contracts/hooks';
import FunctionKey from 'constants/functionKey';

type Options = QueryObserverOptions<
  GetVenusVaiVaultDailyRateOutput,
  Error,
  GetVenusVaiVaultDailyRateOutput,
  GetVenusVaiVaultDailyRateOutput,
  FunctionKey.GET_VENUS_VAI_VAULT_DAILY_RATE_WEI
>;

const useGetVenusVaiVaultDailyRate = (options?: Options) => {
  const comptrollerContract = useComptrollerContract();

  return useQuery(
    FunctionKey.GET_VENUS_VAI_VAULT_DAILY_RATE_WEI,
    () => getVenusVaiVaultDailyRate({ comptrollerContract }),
    options,
  );
};

export default useGetVenusVaiVaultDailyRate;
