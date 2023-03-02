import { QueryObserverOptions, useQuery } from 'react-query';
import { getContractAddress } from 'utilities';

import { GetVenusVaiVaultDailyRateOutput, getVenusVaiVaultDailyRate } from 'clients/api';
import { useComptrollerContract } from 'clients/contracts/hooks';
import FunctionKey from 'constants/functionKey';

type Options = QueryObserverOptions<
  GetVenusVaiVaultDailyRateOutput,
  Error,
  GetVenusVaiVaultDailyRateOutput,
  GetVenusVaiVaultDailyRateOutput,
  FunctionKey.GET_VENUS_VAI_VAULT_DAILY_RATE
>;

const mainPoolComptrollerAddress = getContractAddress('comptroller');

const useGetVenusVaiVaultDailyRate = (options?: Options) => {
  const comptrollerContract = useComptrollerContract(mainPoolComptrollerAddress);

  return useQuery(
    FunctionKey.GET_VENUS_VAI_VAULT_DAILY_RATE,
    () => getVenusVaiVaultDailyRate({ comptrollerContract }),
    options,
  );
};

export default useGetVenusVaiVaultDailyRate;
