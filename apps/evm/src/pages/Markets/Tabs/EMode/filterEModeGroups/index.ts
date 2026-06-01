import type { Pool } from 'types';
import { areTokensEqual, isAssetPaused } from 'utilities';
import type { ExtendedEModeGroup } from '../../types';

export const filterEModeGroups = ({
  pool,
  extendedEModeGroups,
  searchValue,
  showPausedAssets,
  showUserAssetsOnly,
}: {
  pool: Pool;
  extendedEModeGroups: ExtendedEModeGroup[];
  searchValue: string;
  showPausedAssets: boolean;
  showUserAssetsOnly: boolean;
}) =>
  extendedEModeGroups.reduce<ExtendedEModeGroup[]>((acc, extendedEModeGroup) => {
    // Handle search
    const searchMatches = (value: string) =>
      value.toLowerCase().includes(searchValue.toLowerCase());

    const { assetSettings } = extendedEModeGroup;
    const groupNameMatches = searchMatches(extendedEModeGroup.name);

    // An isolation group is anchored by a "main asset", identified by the group
    // label prefix (e.g. "FIL Isolated" -> "FIL"). When that main asset is
    // delisted/paused, the whole isolation group should be hidden by default and
    // only surface when the "Paused assets" toggle is on, so users keep no entry
    // point into an effectively dead pool. This only applies to isolation groups
    // — regular e-mode groups keep the per-asset paused filtering below.
    const mainAssetSymbol = extendedEModeGroup.name.split(' ')[0]?.toLowerCase();
    const mainAssetSettings = assetSettings.find(
      settings => settings.vToken.underlyingToken.symbol.toLowerCase() === mainAssetSymbol,
    );

    if (extendedEModeGroup.isIsolated && mainAssetSettings?.isPaused && !showPausedAssets) {
      return acc;
    }

    let hasUserAsset = false;
    let hasSearchMatch = false;

    // Filter out paused assets if setting is disabled
    const filteredEModeAssetSettings = assetSettings.filter(settings => {
      const asset = pool.assets.find(a => areTokensEqual(settings.vToken, a.vToken));

      if (!asset) {
        return false;
      }

      // Handle user settings
      if (
        !hasUserAsset &&
        (asset.userSupplyBalanceCents.isGreaterThan(0) ||
          asset.userBorrowBalanceCents.isGreaterThan(0) ||
          asset.userWalletBalanceCents.isGreaterThan(0))
      ) {
        hasUserAsset = true;
      }

      if (!hasSearchMatch) {
        const symbolMatches = searchMatches(settings.vToken.underlyingToken.symbol);
        hasSearchMatch = !searchValue || groupNameMatches || symbolMatches;
      }

      const isPausedAsset = isAssetPaused({
        disabledTokenActions: asset.disabledTokenActions,
      });

      return showPausedAssets || !isPausedAsset;
    });

    const includeUserAsset = !showUserAssetsOnly || hasUserAsset;

    const formattedEModeGroup: ExtendedEModeGroup = {
      ...extendedEModeGroup,
      assetSettings: filteredEModeAssetSettings,
    };

    // Filter out groups with no match
    return includeUserAsset && hasSearchMatch ? [...acc, formattedEModeGroup] : acc;
  }, []);
