import { type QueryObserverOptions, useQuery } from '@tanstack/react-query';

import FunctionKey from 'constants/functionKey';
import { featureFlags } from 'hooks/useIsFeatureEnabled';
import { useViemPublicClient } from 'hooks/useViemPublicClient';
import type { ChainId } from 'types';
import { callOrThrow } from 'utilities';
import getSponsorshipVaultData, { type GetSponsorshipVaultDataOutput } from '.';

type UseGetPaymasterDataInput = {
  chainId: ChainId;
};

export type UseGetSponsorshipVaultDataQueryKey = [
  FunctionKey.GET_SPONSORSHIP_VAULT_DATA,
  UseGetPaymasterDataInput,
];

type Options = QueryObserverOptions<
  GetSponsorshipVaultDataOutput,
  Error,
  GetSponsorshipVaultDataOutput,
  GetSponsorshipVaultDataOutput,
  UseGetSponsorshipVaultDataQueryKey
>;

const useGetSponsorshipVaultData = (
  { chainId }: UseGetPaymasterDataInput,
  options?: Partial<Options>,
) => {
  const isFeatureEnabled = !!featureFlags.gaslessTransactions.includes(chainId);
  const publicClient = useViemPublicClient({ chainId });

  return useQuery({
    queryKey: [FunctionKey.GET_SPONSORSHIP_VAULT_DATA, { chainId }],

    queryFn: () =>
      callOrThrow({ publicClient }, params =>
        getSponsorshipVaultData({
          ...params,
        }),
      ),

    ...options,

    enabled: (options?.enabled === undefined || options?.enabled) && isFeatureEnabled,
  });
};

export default useGetSponsorshipVaultData;
