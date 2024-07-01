import { type QueryObserverOptions, useQuery } from '@tanstack/react-query';

import {
  type GetVaiVaultUserInfoInput,
  type GetVaiVaultUserInfoOutput,
  getVaiVaultUserInfo,
} from 'clients/api';
import FunctionKey from 'constants/functionKey';
import { useGetVaiVaultContract } from 'libs/contracts';
import { useChainId } from 'libs/wallet';
import type { ChainId } from 'types';
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

const useGetVaiVaultUserInfo = (
  input: TrimmedGetVaiVaultUserInfoInput,
  options?: Partial<Options>,
) => {
  const { chainId } = useChainId();
  const vaiVaultContract = useGetVaiVaultContract();

  return useQuery({
    queryKey: [FunctionKey.GET_VAI_VAULT_USER_INFO, { ...input, chainId }],
    queryFn: () =>
      callOrThrow({ vaiVaultContract }, params => getVaiVaultUserInfo({ ...params, ...input })),
    ...options,
    enabled: !!vaiVaultContract && (options?.enabled === undefined || options?.enabled),
  });
};

export default useGetVaiVaultUserInfo;
