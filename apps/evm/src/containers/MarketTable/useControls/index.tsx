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
  const [searchValue, setSearchValue] = useState('');
  const [userChainSettings, setUserChainSettings] = useUserChainSettings();

  const { showPausedAssets, showUserAssetsOnly, showUserEModeAssetsOnly } = userChainSettings;

  let userHasAssets = false;
  let userHasEModeGroup = false;
  let pausedAssetsExist = false;

  assets.forEach(asset => {
    const isUserAsset = asset.userWalletBalanceTokens.isGreaterThan(0);

    if (isUserAsset && !userHasAssets) {
      userHasAssets = true;
    }

    const isPaused = isAssetPaused({ disabledTokenActions: asset.disabledTokenActions });
    if (isPaused && !pausedAssetsExist) {
      pausedAssetsExist = true;
    }

    if (asset.userEModeGroupName) {
      userHasEModeGroup = true;
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

    // Handle E-mode setting
    if (
      applyUserSettings &&
      userHasEModeGroup &&
      !asset.userEModeGroupName &&
      showUserEModeAssetsOnly
    ) {
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

  const setShowUserAssetsOnly = (value: boolean) =>
    setUserChainSettings({ showUserAssetsOnly: value });

  const setShowUserEModeAssetsOnly = (value: boolean) =>
    setUserChainSettings({ showUserEModeAssetsOnly: value });

  const setShowPausedAssets = (value: boolean) => setUserChainSettings({ showPausedAssets: value });

  return {
    assets: filteredAssets,
    searchValue,
    setShowUserAssetsOnly,
    setShowPausedAssets,
    setShowUserEModeAssetsOnly,
    onSearchValueChange: setSearchValue,
    pausedAssetsExist,
    userHasAssets,
    userHasEModeGroup,
    showPausedAssets,
    showUserAssetsOnly,
    showUserEModeAssetsOnly,
  };
};
