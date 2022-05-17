import { useQuery, QueryObserverOptions } from 'react-query';

import getVenusVaiVaultRate, {
  GetVenusVaiVaultRateOutput,
} from 'clients/api/queries/getVenusVaiVaultRate';
import FunctionKey from 'constants/functionKey';
import { useComptrollerContract } from 'clients/contracts/hooks';

type Options = QueryObserverOptions<
  GetVenusVaiVaultRateOutput,
  Error,
  GetVenusVaiVaultRateOutput,
  GetVenusVaiVaultRateOutput,
  FunctionKey.GET_VENUS_VAI_VAULT_RATE
>;

const useGetVenusVaiVaultRate = (options?: Options) => {
  const comptrollerContract = useComptrollerContract();

  return useQuery(
    FunctionKey.GET_VENUS_VAI_VAULT_RATE,
    () => getVenusVaiVaultRate({ comptrollerContract }),
    options,
  );
};

export default useGetVenusVaiVaultRate;
