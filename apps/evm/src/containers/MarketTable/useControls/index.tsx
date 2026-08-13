import { useState } from 'react';
import type { Address } from 'viem';

import { useUserChainSettings } from 'hooks/useUserChainSettings';
import type { Asset, MarketCategory } from 'types';
import { isAssetPaused } from 'utilities';

const OTHERS_CATEGORY_TAG = 'others';

export const useControls = ({
  assets,
  applyUserSettings,
  poolComptrollerAddress,
}: {
  assets: Asset[];
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

  const categoriesByTag = new Map<string, MarketCategory>();

  assets.forEach(asset => {
    if (asset.marketCategory && !categoriesByTag.has(asset.marketCategory.tag)) {
      categoriesByTag.set(asset.marketCategory.tag, asset.marketCategory);
    }
  });

  const filteredAssets: Asset[] = [];
  let hiddenPausedAssetsExist = false;

  assets.forEach(asset => {
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
      !selectedCategories.includes(
        asset.category && categoriesByTag.has(asset.category)
          ? asset.category
          : OTHERS_CATEGORY_TAG,
      )
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
    categories: [...categoriesByTag.values()],
    searchValue,
    onSearchValueChange,
    selectedCategories,
    onSelectedCategoriesChange,
    hiddenPausedAssetsExist,
    showPausedAssets,
    showUserAssetsOnly,
  };
};
