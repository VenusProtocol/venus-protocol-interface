import { type QueryObserverOptions, useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';

import FunctionKey from 'constants/functionKey';
import { useIsFeatureEnabled } from 'hooks/useIsFeatureEnabled';
import {
  useGetLegacyPoolComptrollerContractAddress,
  useGetPoolLensContract,
  useGetPrimeContract,
  useGetVaiVaultContract,
  useGetVenusLensContract,
  useGetXvsVaultContract,
} from 'libs/contracts';
import { useGetTokens } from 'libs/tokens';
import { useChainId } from 'libs/wallet';
import type { ChainId, MerklDistribution } from 'types';
import { callOrThrow } from 'utilities';

import { getPendingRewards } from '.';
import { useGetXvsVaultPoolCount } from '../getXvsVaultPoolCount/useGetXvsVaultPoolCount';
import { useGetPools } from '../useGetPools';
import type { GetPendingRewardsInput, GetPendingRewardsOutput } from './types';

type TrimmedGetPendingRewardsInput = Omit<
  GetPendingRewardsInput,
  | 'venusLensContract'
  | 'poolLensContract'
  | 'vaiVaultContract'
  | 'xvsVaultContract'
  | 'resilientOracleContract'
  | 'legacyPoolComptrollerContractAddress'
  | 'isolatedPoolComptrollerAddresses'
  | 'xvsVestingVaultPoolCount'
  | 'xvsTokenAddress'
  | 'tokens'
  | 'chainId'
  | 'merklCampaigns'
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
  const legacyPoolComptrollerContractAddress = useGetLegacyPoolComptrollerContractAddress();
  const venusLensContract = useGetVenusLensContract();
  const poolLensContract = useGetPoolLensContract();
  const vaiVaultContract = useGetVaiVaultContract();
  const xvsVaultContract = useGetXvsVaultContract();
  const primeContract = useGetPrimeContract();

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
      isolatedPoolComptrollerAddresses: string[];
      merklCampaigns: GetPendingRewardsInput['merklCampaigns'];
    }>(
      (acc, pool) => {
        const comptrollerAddresses = pool.isIsolated
          ? [...acc.isolatedPoolComptrollerAddresses, pool.comptrollerAddress]
          : acc.isolatedPoolComptrollerAddresses;

        // list all Merkl rewards for each market present in the pool
        const { assets } = pool;
        const merklRewardsPerAsset = assets.reduce<Record<string, MerklDistribution[]>>(
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
          poolLensContract,
          xvsVaultContract,
        },
        params =>
          getPendingRewards({
            legacyPoolComptrollerContractAddress,
            venusLensContract,
            isolatedPoolComptrollerAddresses: sortedIsolatedPoolComptrollerAddresses,
            xvsVestingVaultPoolCount,
            vaiVaultContract,
            tokens,
            primeContract: isPrimeEnabled ? primeContract : undefined,
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
