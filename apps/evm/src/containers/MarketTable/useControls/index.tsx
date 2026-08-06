import { useState } from 'react';
import type { Address } from 'viem';

import { useUserChainSettings } from 'hooks/useUserChainSettings';
import type { Asset } from 'types';
import { isAssetPaused } from 'utilities';

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

  let pausedAssetsExist = false;

  assets.forEach(asset => {
    const isPaused = isAssetPaused({ disabledTokenActions: asset.disabledTokenActions });
    if (isPaused && !pausedAssetsExist) {
      pausedAssetsExist = true;
    }
  });

  const filteredAssets: Asset[] = [];

  assets.forEach(asset => {
    const isUserAsset = asset.userWalletBalanceTokens.isGreaterThan(0);

    if (applyUserSettings && !isUserAsset && showUserAssetsOnly) {
      return;
    }

    const isPaused = isAssetPaused({ disabledTokenActions: asset.disabledTokenActions });

    // Handle paused assets
    if (applyUserSettings && isPaused && !showPausedAssets) {
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

    filteredAssets.push(asset);
  });

  return {
    assets: filteredAssets,
    searchValue,
    onSearchValueChange,
    selectedCategories,
    onSelectedCategoriesChange,
    pausedAssetsExist,
    showPausedAssets,
    showUserAssetsOnly,
  };
};
