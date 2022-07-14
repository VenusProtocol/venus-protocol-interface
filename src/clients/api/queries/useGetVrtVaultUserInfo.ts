import { QueryObserverOptions, useQuery } from 'react-query';

import {
  IGetVrtVaultUserInfoInput,
  IGetVrtVaultUserInfoOutput,
  getVrtVaultUserInfo,
} from 'clients/api';
import { useVrtVaultProxyContract } from 'clients/contracts/hooks';
import FunctionKey from 'constants/functionKey';

type Options = QueryObserverOptions<
  IGetVrtVaultUserInfoOutput,
  Error,
  IGetVrtVaultUserInfoOutput,
  IGetVrtVaultUserInfoOutput,
  [FunctionKey.GET_VRT_VAULT_USER_INFO, string]
>;

const useGetVrtVaultUserInfo = (
  { accountAddress }: Omit<IGetVrtVaultUserInfoInput, 'vrtVaultContract'>,
  options?: Options,
) => {
  const vrtVaultContract = useVrtVaultProxyContract();

  return useQuery(
    [FunctionKey.GET_VRT_VAULT_USER_INFO, accountAddress],
    () => getVrtVaultUserInfo({ vrtVaultContract, accountAddress }),
    options,
  );
};

export default useGetVrtVaultUserInfo;
