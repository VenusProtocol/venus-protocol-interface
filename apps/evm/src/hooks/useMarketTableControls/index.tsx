import { useState } from 'react';

import { useUserChainSettings } from 'hooks/useUserChainSettings';
import type { Asset } from 'types';
import { isAssetPaused } from 'utilities';

// TODO: add tests

export const useMarketTableControls = ({
  assets,
}: {
  assets: Asset[];
}) => {
  const [searchValue, setSearchValue] = useState('');
  const [userChainSettings, setUserChainSettings] = useUserChainSettings();

  const { showPausedAssets: _showPausedAssets, showUserAssetsOnly: _showUserAssetsOnly } =
    userChainSettings;

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

  const showUserAssetsOnly = _showUserAssetsOnly && userHasAssets;
  const showPausedAssets = _showPausedAssets && pausedAssetsExist;

  const formattedAssets: Asset[] = [];

  assets.forEach(asset => {
    const isUserAsset = asset.userWalletBalanceTokens.isGreaterThan(0);

    if (!isUserAsset && showUserAssetsOnly) {
      return;
    }

    const isPaused = isAssetPaused({ disabledTokenActions: asset.disabledTokenActions });

    // Handle paused assets
    if (isPaused && !showPausedAssets) {
      return;
    }

    // Handle search
    if (
      !!searchValue &&
      !asset.vToken.underlyingToken.symbol.toLowerCase().includes(searchValue.toLowerCase())
    ) {
      return;
    }

    formattedAssets.push(asset);
  });

  const setShowUserAssetsOnly = (value: boolean) =>
    setUserChainSettings({ showUserAssetsOnly: value });

  const setShowPausedAssets = (value: boolean) => setUserChainSettings({ showPausedAssets: value });

  return {
    assets: formattedAssets,
    searchValue,
    onShowUserAssetsOnlyToggleChange: setShowUserAssetsOnly,
    onShowPausedAssetsToggleChange: setShowPausedAssets,
    onSearchValueChange: setSearchValue,
    pausedAssetsExist,
    userHasAssets,
    showPausedAssets,
    showUserAssetsOnly,
  };
};
