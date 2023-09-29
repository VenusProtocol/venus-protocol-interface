import { useGetMainPoolComptrollerContract } from 'packages/contractsNew';
import { QueryObserverOptions, useQuery } from 'react-query';
import { callOrThrow } from 'utilities';

import { GetVenusVaiVaultDailyRateOutput, getVenusVaiVaultDailyRate } from 'clients/api';
import FunctionKey from 'constants/functionKey';

type Options = QueryObserverOptions<
  GetVenusVaiVaultDailyRateOutput,
  Error,
  GetVenusVaiVaultDailyRateOutput,
  GetVenusVaiVaultDailyRateOutput,
  FunctionKey.GET_VENUS_VAI_VAULT_DAILY_RATE
>;

const useGetVenusVaiVaultDailyRate = (options?: Options) => {
  const mainPoolComptrollerContract = useGetMainPoolComptrollerContract();

  return useQuery(
    FunctionKey.GET_VENUS_VAI_VAULT_DAILY_RATE,
    () => callOrThrow({ mainPoolComptrollerContract }, getVenusVaiVaultDailyRate),
    options,
  );
};

export default useGetVenusVaiVaultDailyRate;
