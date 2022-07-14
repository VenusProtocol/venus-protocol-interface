import { QueryObserverOptions, useQuery } from 'react-query';

import getXvsVaultPoolInfo, {
  IGetXvsVaultPoolInfoInput,
  IGetXvsVaultPoolInfoOutput,
} from 'clients/api/queries/getXvsVaultPoolInfo';
import { useXvsVaultProxyContract } from 'clients/contracts/hooks';
import FunctionKey from 'constants/functionKey';

type Options = QueryObserverOptions<
  IGetXvsVaultPoolInfoOutput,
  Error,
  IGetXvsVaultPoolInfoOutput,
  IGetXvsVaultPoolInfoOutput,
  [FunctionKey.GET_XVS_VAULT_POOL_INFOS, Omit<IGetXvsVaultPoolInfoInput, 'xvsVaultContract'>]
>;

const useGetXvsVaultPoolInfo = (
  params: Omit<IGetXvsVaultPoolInfoInput, 'xvsVaultContract'>,
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
