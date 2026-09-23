import { type QueryObserverOptions, useQuery } from '@tanstack/react-query';
import type { Address } from 'viem';

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

  return useQuery({
    queryKey: [FunctionKey.GET_SPOKE_POOLS, { chainId, ...input }],
    queryFn: () => getSpokePools({ chainId, tokens, publicClient, ...input }),
    refetchInterval,
    ...options,
    enabled: (options?.enabled === undefined || options?.enabled) && isSpokeEnabled,
  });
};
