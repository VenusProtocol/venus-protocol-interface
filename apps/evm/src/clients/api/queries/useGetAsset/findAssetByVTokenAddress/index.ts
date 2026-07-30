import type { Asset, Pool } from 'types';
import { areAddressesEqual } from 'utilities';
import type { Address } from 'viem';

export const findAssetByVTokenAddress = ({
  pools,
  vTokenAddress,
}: {
  pools: Pool[] | undefined;
  vTokenAddress: Address | undefined;
}): Asset | undefined => {
  if (!pools || !vTokenAddress) {
    return undefined;
  }

  for (const pool of pools) {
    const matchingAsset = pool.assets.find(asset =>
      areAddressesEqual(asset.vToken.address, vTokenAddress),
    );

    if (matchingAsset) {
      return matchingAsset;
    }
  }

  return undefined;
};
