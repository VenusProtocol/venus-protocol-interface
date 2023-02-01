import { QueryObserverOptions, useQuery } from 'react-query';

import getXvsVaultUserInfo, {
  GetXvsVaultUserInfoInput,
  GetXvsVaultUserInfoOutput,
} from 'clients/api/queries/getXvsVaultUserInfo';
import { useXvsVaultContract } from 'clients/contracts/hooks';
import FunctionKey from 'constants/functionKey';

type Options = QueryObserverOptions<
  GetXvsVaultUserInfoOutput,
  Error,
  GetXvsVaultUserInfoOutput,
  GetXvsVaultUserInfoOutput,
  [FunctionKey.GET_XVS_VAULT_USER_INFO, Omit<GetXvsVaultUserInfoInput, 'xvsVaultContract'>]
>;

const useGetXvsVaultUserInfo = (
  params: Omit<GetXvsVaultUserInfoInput, 'xvsVaultContract'>,
  options?: Options,
) => {
  const xvsVaultContract = useXvsVaultContract();

  return useQuery(
    [FunctionKey.GET_XVS_VAULT_USER_INFO, params],
    () => getXvsVaultUserInfo({ xvsVaultContract, ...params }),
    options,
  );
};

export default useGetXvsVaultUserInfo;
