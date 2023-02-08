import { QueryObserverOptions, useQuery } from 'react-query';

import getXvsVaultPoolCount, {
  GetXvsVaultPoolCountOutput,
} from 'clients/api/queries/getXvsVaultPoolCount';
import { useXvsVaultProxyContract } from 'clients/contracts/hooks';
import FunctionKey from 'constants/functionKey';

type Options = QueryObserverOptions<
  GetXvsVaultPoolCountOutput,
  Error,
  GetXvsVaultPoolCountOutput,
  GetXvsVaultPoolCountOutput,
  FunctionKey.GET_XVS_VAULT_POOLS_COUNT
>;

const useGetXvsVaultPoolCount = (options?: Options) => {
  const xvsVaultContract = useXvsVaultProxyContract();

  return useQuery(
    FunctionKey.GET_XVS_VAULT_POOLS_COUNT,
    () => getXvsVaultPoolCount({ xvsVaultContract }),
    options,
  );
};

export default useGetXvsVaultPoolCount;
