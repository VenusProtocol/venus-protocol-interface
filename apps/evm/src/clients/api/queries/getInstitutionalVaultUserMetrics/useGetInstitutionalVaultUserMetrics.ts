import { type QueryObserverOptions, useQuery } from '@tanstack/react-query';
import type { Address } from 'viem';

import { NULL_ADDRESS } from 'constants/address';
import FunctionKey from 'constants/functionKey';
import { useAccountAddress, useChainId, usePublicClient } from 'libs/wallet';
import type { ChainId } from 'types';
import { callOrThrow } from 'utilities';
import { type GetInstitutionalVaultUserMetricsOutput, getInstitutionalVaultUserMetrics } from '.';

export type UseGetInstitutionalVaultUserMetricsQueryKey = [
  FunctionKey.GET_INSTITUTIONAL_VAULT_USER_METRICS,
  { chainId: ChainId; accountAddress: Address; vaultAddresses: Address[] },
];

type Options = QueryObserverOptions<
  GetInstitutionalVaultUserMetricsOutput,
  Error,
  GetInstitutionalVaultUserMetricsOutput,
  GetInstitutionalVaultUserMetricsOutput,
  UseGetInstitutionalVaultUserMetricsQueryKey
>;

export interface UseGetInstitutionalVaultUserMetricsInput {
  vaultAddresses: Address[];
}

export const useGetInstitutionalVaultUserMetrics = (
  { vaultAddresses }: UseGetInstitutionalVaultUserMetricsInput,
  options?: Partial<Options>,
) => {
  const { publicClient } = usePublicClient();
  const { chainId } = useChainId();
  const { accountAddress } = useAccountAddress();

  return useQuery({
    queryKey: [
      FunctionKey.GET_INSTITUTIONAL_VAULT_USER_METRICS,
      { chainId, accountAddress: accountAddress ?? NULL_ADDRESS, vaultAddresses },
    ],
    queryFn: () =>
      callOrThrow({ accountAddress }, params =>
        getInstitutionalVaultUserMetrics({
          publicClient,
          ...params,
          vaultAddresses,
        }),
      ),
    enabled: vaultAddresses.length > 0 && !!accountAddress,
    ...options,
  });
};
