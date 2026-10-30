import { useGetLiquidityHubs, useGetPool, useGetVaults } from 'clients/api';
import { useChain } from 'hooks/useChain';
import { useIsFeatureEnabled } from 'hooks/useIsFeatureEnabled';
import { useAccountAddress } from 'libs/wallet';
import { type MarketCategory, VaultType, type VenusVault } from 'types';
import { aggregateEarnAssets } from '../aggregateEarnAssets';
import { isVisibleEarnAsset } from '../isVisibleEarnAsset';

export const useEarnAssets = () => {
  const { accountAddress } = useAccountAddress();
  const { corePoolComptrollerContractAddress } = useChain();
  const isLiquidityHubEnabled = useIsFeatureEnabled({ name: 'liquidityHub' });

  const { data: getPoolData, isLoading: isGetPoolLoading } = useGetPool({
    poolComptrollerAddress: corePoolComptrollerContractAddress,
    accountAddress,
  });
  const { data: getLiquidityHubsData, isLoading: isGetLiquidityHubsLoading } = useGetLiquidityHubs({
    accountAddress,
  });
  const { data: vaults, isLoading: isGetVaultsLoading } = useGetVaults({ accountAddress });

  const assets = getPoolData?.pool.assets ?? [];
  const liquidityHubs = getLiquidityHubsData?.liquidityHubs ?? [];
  const eModeGroups = getPoolData?.pool.eModeGroups ?? [];

  const hubShareTokenAddresses = liquidityHubs.map(liquidityHub => liquidityHub.vhToken.address);

  const xvsVaults = vaults.filter(
    (vault): vault is VenusVault =>
      vault.vaultType === VaultType.Venus && vault.stakedToken.symbol === 'XVS',
  );

  const earnAssets = aggregateEarnAssets({ assets, liquidityHubs, vaults: xvsVaults }).filter(
    earnAsset => isVisibleEarnAsset({ earnAsset, eModeGroups, hubShareTokenAddresses }),
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
    isLoading:
      isGetPoolLoading ||
      isGetVaultsLoading ||
      (isLiquidityHubEnabled && isGetLiquidityHubsLoading),
    isReady:
      !!getPoolData?.pool &&
      !isGetVaultsLoading &&
      (!isLiquidityHubEnabled || !!getLiquidityHubsData),
  };
};
