import { QueryObserverOptions, useQuery } from 'react-query';
import { callOrThrow } from 'utilities';

import { GetVenusVaiVaultDailyRateOutput, getVenusVaiVaultDailyRate } from 'clients/api';
import { useGetUniqueContract } from 'clients/contracts';
import FunctionKey from 'constants/functionKey';

type Options = QueryObserverOptions<
  GetVenusVaiVaultDailyRateOutput,
  Error,
  GetVenusVaiVaultDailyRateOutput,
  GetVenusVaiVaultDailyRateOutput,
  FunctionKey.GET_VENUS_VAI_VAULT_DAILY_RATE
>;

const useGetVenusVaiVaultDailyRate = (options?: Options) => {
  const mainPoolComptrollerContract = useGetUniqueContract({
    name: 'mainPoolComptroller',
  });

  return useQuery(
    FunctionKey.GET_VENUS_VAI_VAULT_DAILY_RATE,
    () => callOrThrow({ mainPoolComptrollerContract }, getVenusVaiVaultDailyRate),
    options,
  );
};

export default useGetVenusVaiVaultDailyRate;
