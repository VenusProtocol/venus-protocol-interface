import { useState } from 'react';

import { useUserChainSettings } from 'hooks/useUserChainSettings';
import type { Asset, EModeGroup } from 'types';
import { areTokensEqual, isAssetPaused } from 'utilities';

export const useControls = ({
  assets,
  applyUserSettings,
  userEModeGroup,
}: {
  assets: Asset[];
  applyUserSettings: boolean;
  userEModeGroup?: EModeGroup;
}) => {
  const [searchValue, setSearchValue] = useState('');
  const [userChainSettings, setUserChainSettings] = useUserChainSettings();

  const { showPausedAssets, showUserAssetsOnly, showUserEModeAssetsOnly } = userChainSettings;

  let userHasAssets = false;
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
    const isInUserEModeGroup = (userEModeGroup?.assetSettings || []).some(a =>
      areTokensEqual(a.vToken, asset.vToken),
    );

    if (applyUserSettings && userEModeGroup && !isInUserEModeGroup && showUserEModeAssetsOnly) {
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
    showPausedAssets,
    showUserAssetsOnly,
    showUserEModeAssetsOnly,
  };
};
