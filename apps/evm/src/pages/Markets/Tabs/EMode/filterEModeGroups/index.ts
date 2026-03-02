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

    const filteredEModeAssetSettings = assetSettings.filter(settings => {
      const asset = pool.assets.find(a => areTokensEqual(settings.vToken, a.vToken));

      if (!asset) {
        return false;
      }

      // Handle user settings
      const hasUserAsset =
        asset.userSupplyBalanceCents.isGreaterThan(0) ||
        asset.userBorrowBalanceCents.isGreaterThan(0) ||
        asset.userWalletBalanceCents.isGreaterThan(0);

      const isPausedAsset = isAssetPaused({
        disabledTokenActions: asset.disabledTokenActions,
      });

      const symbolMatches = searchMatches(settings.vToken.underlyingToken.symbol);
      const includeSearch = !searchValue || groupNameMatches || symbolMatches;

      const includePausedAsset = showPausedAssets || !isPausedAsset;
      const includeUserAsset = !showUserAssetsOnly || hasUserAsset;

      return includeSearch && includePausedAsset && includeUserAsset;
    });

    return filteredEModeAssetSettings.length > 0 ? [...acc, extendedEModeGroup] : acc;
  }, []);
