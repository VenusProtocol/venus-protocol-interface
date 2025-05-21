import { type QueryObserverOptions, useQuery } from '@tanstack/react-query';

import {
  type GetXvsVaultTotalAllocPointsInput,
  type GetXvsVaultTotalAllocPointsOutput,
  getXvsVaultTotalAllocationPoints,
} from 'clients/api/queries/getXvsVaultTotalAllocationPoints';
import FunctionKey from 'constants/functionKey';
import { useGetContractAddress } from 'hooks/useGetContractAddress';
import { useChainId, usePublicClient } from 'libs/wallet';
import type { ChainId } from 'types';
import { callOrThrow } from 'utilities';

type TrimmedGetXvsVaultTotalAllocPointsInput = Omit<
  GetXvsVaultTotalAllocPointsInput,
  'publicClient' | 'xvsVaultContractAddress'
>;

export type UseGetXvsVaultTotalAllocationPointsQueryKey = [
  FunctionKey.GET_XVS_VAULT_TOTAL_ALLOCATION_POINTS,
  TrimmedGetXvsVaultTotalAllocPointsInput & {
    chainId: ChainId;
  },
];

type Options = QueryObserverOptions<
  GetXvsVaultTotalAllocPointsOutput,
  Error,
  GetXvsVaultTotalAllocPointsOutput,
  GetXvsVaultTotalAllocPointsOutput,
  UseGetXvsVaultTotalAllocationPointsQueryKey
>;

export const useGetXvsVaultTotalAllocationPoints = (
  input: TrimmedGetXvsVaultTotalAllocPointsInput,
  options?: Partial<Options>,
) => {
  const { chainId } = useChainId();
  const { publicClient } = usePublicClient();
  const { address: xvsVaultContractAddress } = useGetContractAddress({
    name: 'XvsVault',
  });

  return useQuery({
    queryKey: [FunctionKey.GET_XVS_VAULT_TOTAL_ALLOCATION_POINTS, { ...input, chainId }],
    queryFn: () =>
      callOrThrow({ xvsVaultContractAddress }, params =>
        getXvsVaultTotalAllocationPoints({
          ...params,
          ...input,
          publicClient,
        }),
      ),
    ...options,
  });
};
