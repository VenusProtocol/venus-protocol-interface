import type { EModeGroup } from 'types';
import { areAddressesEqual } from 'utilities';
import type { LiteEarnAsset } from '../types';
import { isRestrictedAsset } from './isRestrictedAsset';

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
