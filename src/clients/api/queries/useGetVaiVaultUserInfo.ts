import { useQuery, QueryObserverOptions } from 'react-query';
import {
  getVaiVaultUserInfo,
  IGetVaiVaultUserInfoInput,
  GetVaiVaultUserInfoOutput,
} from 'clients/api';
import FunctionKey from 'constants/functionKey';
import { useVaiVaultContract } from 'clients/contracts/hooks';

type Options = QueryObserverOptions<
  GetVaiVaultUserInfoOutput,
  Error,
  GetVaiVaultUserInfoOutput,
  GetVaiVaultUserInfoOutput,
  [FunctionKey.GET_VAI_VAULT_USER_INFO, string]
>;

const useGetVaiVaultUserInfo = (
  { accountAddress }: Omit<IGetVaiVaultUserInfoInput, 'vaiVaultContract'>,
  options?: Options,
) => {
  const vaiVaultContract = useVaiVaultContract();

  return useQuery(
    [FunctionKey.GET_VAI_VAULT_USER_INFO, accountAddress],
    () => getVaiVaultUserInfo({ vaiVaultContract, accountAddress }),
    options,
  );
};

export default useGetVaiVaultUserInfo;
