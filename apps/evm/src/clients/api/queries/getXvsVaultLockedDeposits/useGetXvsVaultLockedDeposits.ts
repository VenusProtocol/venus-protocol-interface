import { type QueryObserverOptions, useQuery } from '@tanstack/react-query';

import {
  type GetXvsVaultLockedDepositsInput,
  type GetXvsVaultLockedDepositsOutput,
  getXvsVaultLockedDeposits,
} from 'clients/api/queries/getXvsVaultLockedDeposits';
import FunctionKey from 'constants/functionKey';
import { useGetXvsVaultContractAddress } from 'libs/contracts';
import { useChainId, usePublicClient } from 'libs/wallet';
import type { ChainId } from 'types';
import { callOrThrow } from 'utilities';

type TrimmedGetXvsVaultLockedDepositsInput = Omit<
  GetXvsVaultLockedDepositsInput,
  'xvsVaultContractAddress' | 'publicClient'
>;

export type UseGetXvsVaultLockedDepositsQueryKey = [
  FunctionKey.GET_XVS_VAULT_WITHDRAWAL_REQUESTS,
  TrimmedGetXvsVaultLockedDepositsInput & {
    chainId: ChainId;
  },
];

type Options = QueryObserverOptions<
  GetXvsVaultLockedDepositsOutput,
  Error,
  GetXvsVaultLockedDepositsOutput,
  GetXvsVaultLockedDepositsOutput,
  UseGetXvsVaultLockedDepositsQueryKey
>;

export const useGetXvsVaultLockedDeposits = (
  input: TrimmedGetXvsVaultLockedDepositsInput,
  options?: Partial<Options>,
) => {
  const { chainId } = useChainId();
  const { publicClient } = usePublicClient();
  const xvsVaultContractAddress = useGetXvsVaultContractAddress();

  return useQuery({
    queryKey: [FunctionKey.GET_XVS_VAULT_WITHDRAWAL_REQUESTS, { ...input, chainId }],
    queryFn: () =>
      callOrThrow({ xvsVaultContractAddress }, params =>
        getXvsVaultLockedDeposits({
          ...params,
          ...input,
          publicClient,
        }),
      ),
    ...options,
  });
};
