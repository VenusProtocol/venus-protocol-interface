import { useQuery, QueryObserverOptions } from 'react-query';
import {
  getVrtVaultUserInfo,
  IGetVrtVaultUserInfoInput,
  IGetVrtVaultUserInfoOutput,
} from 'clients/api';
import FunctionKey from 'constants/functionKey';
import { useVrtVaultProxyContract } from 'clients/contracts/hooks';

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
