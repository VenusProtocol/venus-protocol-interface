import { QueryObserverOptions, useQuery } from 'react-query';

import getXvsVaultPoolInfo, {
  GetXvsVaultPoolInfoInput,
  GetXvsVaultPoolInfoOutput,
} from 'clients/api/queries/getXvsVaultPoolInfo';
import { useXvsVaultProxyContract } from 'clients/contracts/hooks';
import FunctionKey from 'constants/functionKey';

type Options = QueryObserverOptions<
  GetXvsVaultPoolInfoOutput,
  Error,
  GetXvsVaultPoolInfoOutput,
  GetXvsVaultPoolInfoOutput,
  [FunctionKey.GET_XVS_VAULT_POOL_INFOS, Omit<GetXvsVaultPoolInfoInput, 'xvsVaultContract'>]
>;

const useGetXvsVaultPoolInfo = (
  params: Omit<GetXvsVaultPoolInfoInput, 'xvsVaultContract'>,
  options?: Options,
) => {
  const xvsVaultContract = useXvsVaultProxyContract();

  return useQuery(
    [FunctionKey.GET_XVS_VAULT_POOL_INFOS, params],
    () => getXvsVaultPoolInfo({ xvsVaultContract, ...params }),
    options,
  );
};

export default useGetXvsVaultPoolInfo;
