import { useState } from 'react';

import { useUserChainSettings } from 'hooks/useUserChainSettings';
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
  const [userChainSettings] = useUserChainSettings();

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

    filteredAssets.push(asset);
  });

  return {
    assets: filteredAssets,
    searchValue,
    onSearchValueChange: onSearchValueChange,
    pausedAssetsExist,
    showPausedAssets,
    showUserAssetsOnly,
  };
};
