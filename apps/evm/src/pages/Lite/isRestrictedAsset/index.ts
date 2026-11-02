import type { Asset, EModeGroup } from 'types';
import { areTokensEqual } from 'utilities';
import { isAssetPaused } from 'utilities/isAssetPaused';

export const isRestrictedAsset = ({
  asset,
  eModeGroups,
}: {
  asset: Asset;
  eModeGroups: EModeGroup[];
}) => {
  if (isAssetPaused({ disabledTokenActions: asset.disabledTokenActions })) {
    return true;
  }

  if (asset.collateralFactor > 0 || asset.isBorrowable) {
    return false;
  }

  return eModeGroups.some(
    eModeGroup =>
      eModeGroup.isIsolated &&
      eModeGroup.assetSettings.some(assetSettings =>
        areTokensEqual(assetSettings.vToken, asset.vToken),
      ),
  );
};
