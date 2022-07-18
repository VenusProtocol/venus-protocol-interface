import { QueryObserverOptions, useQuery } from 'react-query';

import getXvsVaultUserInfo, {
  IGetXvsVaultUserInfoInput,
  IGetXvsVaultUserInfoOutput,
} from 'clients/api/queries/getXvsVaultUserInfo';
import { useXvsVaultProxyContract } from 'clients/contracts/hooks';
import FunctionKey from 'constants/functionKey';

type Options = QueryObserverOptions<
  IGetXvsVaultUserInfoOutput,
  Error,
  IGetXvsVaultUserInfoOutput,
  IGetXvsVaultUserInfoOutput,
  [FunctionKey.GET_XVS_VAULT_USER_INFO, Omit<IGetXvsVaultUserInfoInput, 'xvsVaultContract'>]
>;

const useGetXvsVaultUserInfo = (
  params: Omit<IGetXvsVaultUserInfoInput, 'xvsVaultContract'>,
  options?: Options,
) => {
  const xvsVaultContract = useXvsVaultProxyContract();

  return useQuery(
    [FunctionKey.GET_XVS_VAULT_USER_INFO, params],
    () => getXvsVaultUserInfo({ xvsVaultContract, ...params }),
    options,
  );
};

export default useGetXvsVaultUserInfo;
