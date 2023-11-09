import { useGetVaiVaultContract } from 'packages/contracts';
import { QueryObserverOptions, useQuery } from 'react-query';
import { ChainId } from 'types';
import { callOrThrow } from 'utilities';

import {
  GetVaiVaultUserInfoInput,
  GetVaiVaultUserInfoOutput,
  getVaiVaultUserInfo,
} from 'clients/api';
import FunctionKey from 'constants/functionKey';
import { useAuth } from 'context/AuthContext';

type TrimmedGetVaiVaultUserInfoInput = Omit<GetVaiVaultUserInfoInput, 'vaiVaultContract'>;

export type UseGetVaiVaultUserInfoQueryKey = [
  FunctionKey.GET_VAI_VAULT_USER_INFO,
  TrimmedGetVaiVaultUserInfoInput & {
    chainId: ChainId;
  },
];

type Options = QueryObserverOptions<
  GetVaiVaultUserInfoOutput,
  Error,
  GetVaiVaultUserInfoOutput,
  GetVaiVaultUserInfoOutput,
  UseGetVaiVaultUserInfoQueryKey
>;

const useGetVaiVaultUserInfo = (input: TrimmedGetVaiVaultUserInfoInput, options?: Options) => {
  const { chainId } = useAuth();
  const vaiVaultContract = useGetVaiVaultContract();

  return useQuery(
    [FunctionKey.GET_VAI_VAULT_USER_INFO, { ...input, chainId }],
    () => callOrThrow({ vaiVaultContract }, params => getVaiVaultUserInfo({ ...params, ...input })),
    options,
  );
};

export default useGetVaiVaultUserInfo;
