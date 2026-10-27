import { useGetLiquidityHubs, useGetPool } from 'clients/api';
import { useChain } from 'hooks/useChain';
import { useAccountAddress } from 'libs/wallet';
import type { MarketCategory } from 'types';
import { aggregateEarnAssets } from '../aggregateEarnAssets';
import { isVisibleEarnAsset } from '../isVisibleEarnAsset';

export const useEarnAssets = () => {
  const { accountAddress } = useAccountAddress();
  const { corePoolComptrollerContractAddress } = useChain();

  const { data: getPoolData, isLoading: isGetPoolLoading } = useGetPool({
    poolComptrollerAddress: corePoolComptrollerContractAddress,
    accountAddress,
  });
  const { data: getLiquidityHubsData, isLoading: isGetLiquidityHubsLoading } = useGetLiquidityHubs({
    accountAddress,
  });

  const assets = getPoolData?.pool.assets ?? [];
  const liquidityHubs = getLiquidityHubsData?.liquidityHubs ?? [];
  const eModeGroups = getPoolData?.pool.eModeGroups ?? [];

  const hubShareTokenAddresses = liquidityHubs.map(liquidityHub => liquidityHub.vhToken.address);

  const earnAssets = aggregateEarnAssets({ assets, liquidityHubs }).filter(earnAsset =>
    isVisibleEarnAsset({ earnAsset, eModeGroups, hubShareTokenAddresses }),
  );

  const categoriesByTag = new Map<string, MarketCategory>();
  assets.forEach(asset => {
    if (asset.marketCategory) {
      categoriesByTag.set(asset.marketCategory.tag, asset.marketCategory);
    }
  });

  return {
    earnAssets,
    categories: [...categoriesByTag.values()].sort((a, b) => a.order - b.order),
    isLoading: isGetPoolLoading || isGetLiquidityHubsLoading,
    isReady: !!getPoolData?.pool && !!getLiquidityHubsData,
  };
};
