import { type QueryObserverOptions, useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import type { Address } from 'viem';

import { useGetIpLocation } from 'clients/api/queries/useGetIpLocation';
import { applyCountryCodeToPools } from 'clients/api/queries/useGetPools/applyCountryCodeToPools';
import { useGetPoolsQuery } from 'clients/api/queries/useGetPools/useGetPoolsQuery';
import FunctionKey from 'constants/functionKey';
import { useIsFeatureEnabled } from 'hooks/useIsFeatureEnabled';
import { useGetTokens } from 'libs/tokens';
import { useChainId, usePublicClient } from 'libs/wallet';
import type { ChainId } from 'types';
import { generatePseudoRandomRefetchInterval } from 'utilities/generatePseudoRandomRefetchInterval';

import { type GetSpokePoolsOutput, getSpokePools } from '..';

export interface UseGetSpokePoolsInput {
  accountAddress?: Address;
}

export type UseGetSpokePoolsQueryKey = [
  FunctionKey.GET_SPOKE_POOLS,
  { chainId: ChainId; accountAddress?: Address },
];

type Options = QueryObserverOptions<
  GetSpokePoolsOutput,
  Error,
  GetSpokePoolsOutput,
  GetSpokePoolsOutput,
  UseGetSpokePoolsQueryKey
>;

const refetchInterval = generatePseudoRandomRefetchInterval();

export const useGetSpokePools = (input?: UseGetSpokePoolsInput, options?: Partial<Options>) => {
  const { chainId } = useChainId();
  const { publicClient } = usePublicClient();
  const tokens = useGetTokens({ chainId });
  const isSpokeEnabled = useIsFeatureEnabled({ name: 'spoke' });

  const isEnabled = (options?.enabled === undefined || options?.enabled) && isSpokeEnabled;

  const spokePoolsQuery = useQuery({
    queryKey: [FunctionKey.GET_SPOKE_POOLS, { chainId, ...input }],
    queryFn: () => getSpokePools({ chainId, tokens, publicClient, ...input }),
    refetchInterval,
    ...options,
    enabled: isEnabled,
  });

  const { data: getPoolsData } = useGetPoolsQuery(
    { accountAddress: input?.accountAddress },
    { enabled: isEnabled },
  );

  const { data: getIpLocationData } = useGetIpLocation({ enabled: isEnabled });

  const data = useMemo<GetSpokePoolsOutput | undefined>(() => {
    if (!spokePoolsQuery.data) {
      return undefined;
    }

    return {
      ...spokePoolsQuery.data,
      spokePools: applyCountryCodeToPools({
        countryCode: getIpLocationData?.countryCode,
        pools: spokePoolsQuery.data.spokePools,
        tokenMetadataMapping: getPoolsData?.tokenMetadataMapping ?? {},
      }),
    };
  }, [spokePoolsQuery.data, getIpLocationData?.countryCode, getPoolsData?.tokenMetadataMapping]);

  return {
    ...spokePoolsQuery,
    data,
  };
};
