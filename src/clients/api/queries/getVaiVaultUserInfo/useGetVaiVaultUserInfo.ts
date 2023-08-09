import { QueryObserverOptions, useQuery } from 'react-query';
import { callOrThrow } from 'utilities';

import {
  GetVaiVaultUserInfoInput,
  GetVaiVaultUserInfoOutput,
  getVaiVaultUserInfo,
} from 'clients/api';
import { useGetUniqueContract } from 'clients/contracts';
import FunctionKey from 'constants/functionKey';

type TrimmedGetVaiVaultUserInfoInput = Omit<GetVaiVaultUserInfoInput, 'vaiVaultContract'>;
type Options = QueryObserverOptions<
  GetVaiVaultUserInfoOutput,
  Error,
  GetVaiVaultUserInfoOutput,
  GetVaiVaultUserInfoOutput,
  [FunctionKey.GET_VAI_VAULT_USER_INFO, TrimmedGetVaiVaultUserInfoInput]
>;

const useGetVaiVaultUserInfo = (input: TrimmedGetVaiVaultUserInfoInput, options?: Options) => {
  const vaiVaultContract = useGetUniqueContract({
    name: 'vaiVault',
  });

  return useQuery(
    [FunctionKey.GET_VAI_VAULT_USER_INFO, input],
    () => callOrThrow({ vaiVaultContract }, params => getVaiVaultUserInfo({ ...params, ...input })),
    options,
  );
};

export default useGetVaiVaultUserInfo;
