import type { Asset, EModeGroup } from 'types';
import { areAddressesEqual, areTokensEqual } from 'utilities';
import { isAssetPaused } from 'utilities/isAssetPaused';
import type { LiteEarnAsset } from '../types';

const isRestrictedAsset = ({
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

export const isVisibleEarnAsset = ({
  earnAsset,
  eModeGroups,
  hubShareTokenAddresses,
}: {
  earnAsset: LiteEarnAsset;
  eModeGroups: EModeGroup[];
  hubShareTokenAddresses: string[];
}) => {
  const isHubShareToken = hubShareTokenAddresses.some(address =>
    areAddressesEqual(address, earnAsset.token.address),
  );

  if (isHubShareToken) {
    return false;
  }

  return !earnAsset.markets.some(
    market =>
      market.source.type === 'core' &&
      isRestrictedAsset({ asset: market.source.asset, eModeGroups }),
  );
};
