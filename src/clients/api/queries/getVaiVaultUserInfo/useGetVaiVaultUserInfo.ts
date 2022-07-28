import { QueryObserverOptions, useQuery } from 'react-query';

import {
  GetVaiVaultUserInfoInput,
  GetVaiVaultUserInfoOutput,
  getVaiVaultUserInfo,
} from 'clients/api';
import { useVaiVaultContract } from 'clients/contracts/hooks';
import FunctionKey from 'constants/functionKey';

type Options = QueryObserverOptions<
  GetVaiVaultUserInfoOutput,
  Error,
  GetVaiVaultUserInfoOutput,
  GetVaiVaultUserInfoOutput,
  [FunctionKey.GET_VAI_VAULT_USER_INFO, string]
>;

const useGetVaiVaultUserInfo = (
  { accountAddress }: Omit<GetVaiVaultUserInfoInput, 'vaiVaultContract'>,
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
