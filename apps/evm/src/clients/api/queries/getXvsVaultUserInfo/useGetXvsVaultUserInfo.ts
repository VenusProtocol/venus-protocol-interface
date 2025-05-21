import { type QueryObserverOptions, useQuery } from '@tanstack/react-query';

import {
  type GetXvsVaultUserInfoInput,
  type GetXvsVaultUserInfoOutput,
  getXvsVaultUserInfo,
} from 'clients/api/queries/getXvsVaultUserInfo';
import FunctionKey from 'constants/functionKey';
import { useGetContractAddress } from 'hooks/useGetContractAddress';
import { useChainId, usePublicClient } from 'libs/wallet';
import type { ChainId } from 'types';
import { callOrThrow } from 'utilities';

type TrimmedGetXvsVaultUserInfoInput = Omit<
  GetXvsVaultUserInfoInput,
  'publicClient' | 'xvsVaultContractAddress'
>;

export type UseGetXvsVaultUserInfoQueryKey = [
  FunctionKey.GET_XVS_VAULT_USER_INFO,
  TrimmedGetXvsVaultUserInfoInput & {
    chainId: ChainId;
  },
];

type Options = QueryObserverOptions<
  GetXvsVaultUserInfoOutput,
  Error,
  GetXvsVaultUserInfoOutput,
  GetXvsVaultUserInfoOutput,
  UseGetXvsVaultUserInfoQueryKey
>;

export const useGetXvsVaultUserInfo = (
  input: TrimmedGetXvsVaultUserInfoInput,
  options?: Partial<Options>,
) => {
  const { chainId } = useChainId();
  const { publicClient } = usePublicClient();
  const { address: xvsVaultContractAddress } = useGetContractAddress({
    name: 'XvsVault',
  });

  return useQuery({
    queryKey: [FunctionKey.GET_XVS_VAULT_USER_INFO, { ...input, chainId }],
    queryFn: () =>
      callOrThrow({ xvsVaultContractAddress }, params =>
        getXvsVaultUserInfo({
          ...params,
          ...input,
          publicClient,
        }),
      ),
    ...options,
  });
};
