import { type QueryObserverOptions, useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';

import FunctionKey from 'constants/functionKey';
import { useIsFeatureEnabled } from 'hooks/useIsFeatureEnabled';
import {
  useGetLegacyPoolComptrollerContractAddress,
  useGetPoolLensContractAddress,
  useGetPrimeContractAddress,
  useGetVaiVaultContractAddress,
  useGetVenusLensContractAddress,
  useGetXvsVaultContractAddress,
} from 'libs/contracts';
import { useGetTokens } from 'libs/tokens';
import { useChainId, usePublicClient } from 'libs/wallet';
import type { ChainId, MerklDistribution } from 'types';
import { callOrThrow } from 'utilities';

import type { Address } from 'viem';
import { getPendingRewards } from '.';
import { useGetXvsVaultPoolCount } from '../getXvsVaultPoolCount/useGetXvsVaultPoolCount';
import { useGetPools } from '../useGetPools';
import type { GetPendingRewardsInput, GetPendingRewardsOutput } from './types';

type TrimmedGetPendingRewardsInput = Omit<
  GetPendingRewardsInput,
  | 'venusLensContractAddress'
  | 'poolLensContractAddress'
  | 'vaiVaultContractAddress'
  | 'xvsVaultContractAddress'
  | 'resilientOracleContractAddress'
  | 'legacyPoolComptrollerContractAddress'
  | 'isolatedPoolComptrollerAddresses'
  | 'xvsVestingVaultPoolCount'
  | 'xvsTokenAddress'
  | 'tokens'
  | 'chainId'
  | 'merklCampaigns'
  | 'publicClient'
>;

export type UseGetPendingRewardsQueryKey = [
  FunctionKey.GET_PENDING_REWARDS,
  TrimmedGetPendingRewardsInput & {
    chainId: ChainId;
  },
];

type Options = QueryObserverOptions<
  GetPendingRewardsOutput,
  Error,
  GetPendingRewardsOutput,
  GetPendingRewardsOutput,
  UseGetPendingRewardsQueryKey
>;

const REFETCH_INTERVAL_MS = 60000; // 1 minute

export const useGetPendingRewards = (
  input: TrimmedGetPendingRewardsInput,
  options?: Partial<Options>,
) => {
  const { chainId } = useChainId();
  const { publicClient } = usePublicClient();
  const legacyPoolComptrollerContractAddress = useGetLegacyPoolComptrollerContractAddress();
  const venusLensContractAddress = useGetVenusLensContractAddress();
  const poolLensContractAddress = useGetPoolLensContractAddress();
  const vaiVaultContractAddress = useGetVaiVaultContractAddress();
  const xvsVaultContractAddress = useGetXvsVaultContractAddress();
  const primeContractAddress = useGetPrimeContractAddress();

  const isPrimeEnabled = useIsFeatureEnabled({
    name: 'prime',
  });

  const tokens = useGetTokens();

  // Get Comptroller addresses of isolated pools
  const { data: getPoolsData, isLoading: isGetPoolsLoading } = useGetPools({
    accountAddress: input.accountAddress || undefined,
  });

  const { isolatedPoolComptrollerAddresses, merklCampaigns } = useMemo(() => {
    const data = (getPoolsData?.pools || []).reduce<{
      isolatedPoolComptrollerAddresses: Address[];
      merklCampaigns: GetPendingRewardsInput['merklCampaigns'];
    }>(
      (acc, pool) => {
        const comptrollerAddresses = pool.isIsolated
          ? [...acc.isolatedPoolComptrollerAddresses, pool.comptrollerAddress]
          : acc.isolatedPoolComptrollerAddresses;

        // list all Merkl rewards for each market present in the pool
        const { assets } = pool;
        const merklRewardsPerAsset = assets.reduce<Record<Address, MerklDistribution[]>>(
          (accMerklDistributionsForAsset, a) => {
            const assetMerklRewards = [
              ...a.supplyTokenDistributions.filter(d => d.type === 'merkl'),
              ...a.borrowTokenDistributions.filter(d => d.type === 'merkl'),
            ];

            const entries =
              assetMerklRewards.length > 0
                ? {
                    ...accMerklDistributionsForAsset,
                    [a.vToken.address]: assetMerklRewards,
                  }
                : accMerklDistributionsForAsset;

            return entries;
          },
          {},
        );

        // and then map them by market
        const merklRewards =
          Object.keys(merklRewardsPerAsset).length > 0
            ? {
                ...acc.merklCampaigns,
                ...merklRewardsPerAsset,
              }
            : acc.merklCampaigns;

        return {
          isolatedPoolComptrollerAddresses: comptrollerAddresses,
          merklCampaigns: merklRewards,
        };
      },
      {
        isolatedPoolComptrollerAddresses: [],
        merklCampaigns: {},
      },
    );

    return data;
  }, [getPoolsData?.pools]);

  // Get XVS vesting vault pool count
  const { data: getXvsVaultPoolCountData, isLoading: isGetXvsVaultPoolCountLoading } =
    useGetXvsVaultPoolCount({
      enabled: !!options?.enabled,
    });
  const xvsVestingVaultPoolCount = getXvsVaultPoolCountData?.poolCount || 0;

  // Sort addresses to output the same data when providing them in a different
  // order. This prevents unnecessary queries
  const sortedIsolatedPoolComptrollerAddresses = [...isolatedPoolComptrollerAddresses].sort();

  return useQuery({
    queryKey: [FunctionKey.GET_PENDING_REWARDS, { ...input, chainId }],
    queryFn: () =>
      callOrThrow(
        {
          poolLensContractAddress,
          xvsVaultContractAddress,
        },
        params =>
          getPendingRewards({
            publicClient,
            legacyPoolComptrollerContractAddress,
            isolatedPoolComptrollerAddresses: sortedIsolatedPoolComptrollerAddresses,
            xvsVestingVaultPoolCount,
            venusLensContractAddress,
            vaiVaultContractAddress,
            tokens,
            primeContractAddress: isPrimeEnabled ? primeContractAddress : undefined,
            chainId,
            merklCampaigns,
            ...input,
            ...params,
          }),
      ),
    refetchInterval: REFETCH_INTERVAL_MS,
    ...options,
    enabled:
      (options?.enabled === undefined || options.enabled) &&
      !isGetPoolsLoading &&
      !isGetXvsVaultPoolCountLoading,
  });
};
