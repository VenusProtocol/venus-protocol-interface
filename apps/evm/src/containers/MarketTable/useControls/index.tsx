import { useState } from 'react';
import type { Address } from 'viem';

import { useUserChainSettings } from 'hooks/useUserChainSettings';
import type { Asset, MarketCategory } from 'types';
import { isAssetPaused } from 'utilities';

export const useControls = ({
  assets,
  categories,
  applyUserSettings,
  poolComptrollerAddress,
}: {
  assets: Asset[];
  categories?: MarketCategory[];
  applyUserSettings: boolean;
  poolComptrollerAddress: Address;
}) => {
  const [searchValue, onSearchValueChange] = useState('');
  const [selectedCategories, onSelectedCategoriesChange] = useState<string[]>([]);
  const [userChainSettings] = useUserChainSettings();

  const [prevPoolComptrollerAddress, setPrevPoolComptrollerAddress] =
    useState(poolComptrollerAddress);
  if (poolComptrollerAddress !== prevPoolComptrollerAddress) {
    setPrevPoolComptrollerAddress(poolComptrollerAddress);
    onSelectedCategoriesChange([]);
  }

  const { showPausedAssets, showUserAssetsOnly } = userChainSettings;

  const assetCategoryTags = new Set<string>();
  const filteredAssets: Asset[] = [];
  let hiddenPausedAssetsExist = false;

  assets.forEach(asset => {
    if (asset.category) {
      assetCategoryTags.add(asset.category);
    }

    const isUserAsset = asset.userWalletBalanceTokens.isGreaterThan(0);

    if (applyUserSettings && !isUserAsset && showUserAssetsOnly) {
      return;
    }

    // Handle search
    if (
      !!searchValue &&
      !asset.vToken.underlyingToken.symbol.toLowerCase().includes(searchValue.toLowerCase())
    ) {
      return;
    }

    if (
      selectedCategories.length > 0 &&
      (!asset.category || !selectedCategories.includes(asset.category))
    ) {
      return;
    }

    if (
      applyUserSettings &&
      !showPausedAssets &&
      isAssetPaused({ disabledTokenActions: asset.disabledTokenActions })
    ) {
      hiddenPausedAssetsExist = true;
      return;
    }

    filteredAssets.push(asset);
  });

  return {
    assets: filteredAssets,
    categories: categories?.filter(category => assetCategoryTags.has(category.tag)),
    searchValue,
    onSearchValueChange,
    selectedCategories,
    onSelectedCategoriesChange,
    hiddenPausedAssetsExist,
    showPausedAssets,
    showUserAssetsOnly,
  };
};
