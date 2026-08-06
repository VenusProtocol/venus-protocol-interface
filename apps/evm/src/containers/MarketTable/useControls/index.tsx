import { useState } from 'react';

import { useUserChainSettings } from 'hooks/useUserChainSettings';
import { useChainId } from 'libs/wallet';
import type { Asset } from 'types';
import { isAssetPaused } from 'utilities';

export const useControls = ({
  assets,
  applyUserSettings,
}: {
  assets: Asset[];
  applyUserSettings: boolean;
}) => {
  const [searchValue, onSearchValueChange] = useState('');
  const [selectedCategories, onSelectedCategoriesChange] = useState<string[]>([]);
  const [userChainSettings] = useUserChainSettings();
  const { chainId } = useChainId();

  const [prevChainId, setPrevChainId] = useState(chainId);
  if (chainId !== prevChainId) {
    setPrevChainId(chainId);
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
