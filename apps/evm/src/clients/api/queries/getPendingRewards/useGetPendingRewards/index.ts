import { type QueryObserverOptions, useQuery } from '@tanstack/react-query';

import FunctionKey from 'constants/functionKey';
import { usePrimeVersion } from 'hooks/usePrimeVersion';
import { useGetTokens } from 'libs/tokens';
import { useChainId, usePublicClient } from 'libs/wallet';
import type { ChainId } from 'types';
import { callOrThrow } from 'utilities';

import { useGetContractAddress } from 'hooks/useGetContractAddress';
import type { Address } from 'viem';
import { getPendingRewards } from '..';
import { useGetLiquidityHubs } from '../../getLiquidityHubs/useGetLiquidityHubs';
import { useGetXvsVaultPoolCount } from '../../getXvsVaultPoolCount/useGetXvsVaultPoolCount';
import { useGetPools } from '../../useGetPools';
import { getMerklCampaigns } from '../getMerklCampaigns';
import type { GetPendingRewardsInput, GetPendingRewardsOutput } from '../types';

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
    isolatedPoolComptrollerAddresses: Address[];
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
  const areDependentQueriesEnabled = options?.enabled === undefined || !!options?.enabled;

  const { chainId } = useChainId();
  const { publicClient } = usePublicClient();
  const { address: legacyPoolComptrollerContractAddress } = useGetContractAddress({
    name: 'LegacyPoolComptroller',
  });
  const { address: venusLensContractAddress } = useGetContractAddress({
    name: 'VenusLens',
  });
  const { address: poolLensContractAddress } = useGetContractAddress({
    name: 'PoolLens',
  });
  const { address: vaiVaultContractAddress } = useGetContractAddress({
    name: 'VaiVault',
  });
  const { address: xvsVaultContractAddress } = useGetContractAddress({
    name: 'XvsVault',
  });
  const { address: primeV1ContractAddress } = useGetContractAddress({
    name: 'Prime',
  });
  const { address: primeV2ContractAddress } = useGetContractAddress({
    name: 'PrimeV2',
  });

  const { primeVersion } = usePrimeVersion();
  let primeContractAddress: Address | undefined;
  if (primeVersion === 1) {
    primeContractAddress = primeV1ContractAddress;
  } else if (primeVersion === 2) {
    primeContractAddress = primeV2ContractAddress;
  }

  const tokens = useGetTokens();

  // Get Comptroller addresses of isolated pools
  const { data: getPoolsData, isLoading: isGetPoolsLoading } = useGetPools(
    {
      accountAddress: input.accountAddress || undefined,
    },
    {
      enabled: areDependentQueriesEnabled,
    },
  );

  const { data: getLiquidityHubsData, isLoading: isGetLiquidityHubsLoading } = useGetLiquidityHubs(
    {
      accountAddress: input.accountAddress || undefined,
    },
    {
      enabled: areDependentQueriesEnabled,
    },
  );

  const { isolatedPoolComptrollerAddresses, merklCampaigns } = getMerklCampaigns({
    pools: getPoolsData?.pools,
    liquidityHubs: getLiquidityHubsData?.liquidityHubs,
  });

  // Get XVS vesting vault pool count
  const { data: getXvsVaultPoolCountData, isLoading: isGetXvsVaultPoolCountLoading } =
    useGetXvsVaultPoolCount({
      enabled: areDependentQueriesEnabled,
    });
  const xvsVestingVaultPoolCount = getXvsVaultPoolCountData?.poolCount || 0;

  // Sort addresses to output the same data when providing them in a different
  // order. This prevents unnecessary queries
  const sortedIsolatedPoolComptrollerAddresses = [...isolatedPoolComptrollerAddresses].sort();

  return useQuery({
    queryKey: [
      FunctionKey.GET_PENDING_REWARDS,
      {
        ...input,
        chainId,
        isolatedPoolComptrollerAddresses: sortedIsolatedPoolComptrollerAddresses,
      },
    ],
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
            primeContractAddress,
            primeVersion,
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
      !isGetLiquidityHubsLoading &&
      !isGetXvsVaultPoolCountLoading,
  });
};
