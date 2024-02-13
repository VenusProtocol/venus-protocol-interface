import { useGetVaiVaultContract } from 'libs/contracts';
import { useChainId } from 'libs/wallet';
import { QueryObserverOptions, useQuery } from 'react-query';

import {
  GetVaiVaultUserInfoInput,
  GetVaiVaultUserInfoOutput,
  getVaiVaultUserInfo,
} from 'clients/api';
import FunctionKey from 'constants/functionKey';
import { ChainId } from 'types';
import { callOrThrow } from 'utilities';

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
  const { chainId } = useChainId();
  const vaiVaultContract = useGetVaiVaultContract();

  return useQuery(
    [FunctionKey.GET_VAI_VAULT_USER_INFO, { ...input, chainId }],
    () => callOrThrow({ vaiVaultContract }, params => getVaiVaultUserInfo({ ...params, ...input })),
    {
      ...options,
      enabled: !!vaiVaultContract && (options?.enabled === undefined || options?.enabled),
    },
  );
};

export default useGetVaiVaultUserInfo;
