import { useMemo } from 'react';

import type { Asset, Pool } from 'types';
import { isAssetPaused } from 'utilities';

const isAssetIncluded = ({
  asset,
  shouldDisplayPausedAssets,
  searchValue,
}: {
  asset: Asset;
  searchValue: string;
  shouldDisplayPausedAssets: boolean;
}) => {
  // Handle paused assets
  if (
    !shouldDisplayPausedAssets &&
    isAssetPaused({ disabledTokenActions: asset.disabledTokenActions })
  ) {
    return false;
  }

  // Handle search
  if (!searchValue) {
    return true;
  }

  const lowerCasedSearchValue = searchValue.toLowerCase();
  return asset.vToken.underlyingToken.symbol.toLowerCase().includes(lowerCasedSearchValue);
};

const useFormatPools = ({
  pools,
  searchValue,
  shouldDisplayPausedAssets,
  selectedPoolIndex,
}: {
  pools: Pool[];
  searchValue: string;
  shouldDisplayPausedAssets: boolean;
  selectedPoolIndex: number;
}) => {
  const formattedPools = useMemo(() => {
    const filteredPools = selectedPoolIndex < 0 ? pools : [pools[selectedPoolIndex]];

    return filteredPools.map(pool => ({
      ...pool,
      assets: pool.assets.filter(asset =>
        isAssetIncluded({
          asset,
          shouldDisplayPausedAssets,
          searchValue,
        }),
      ),
    }));
  }, [pools, searchValue, selectedPoolIndex, shouldDisplayPausedAssets]);

  return formattedPools;
};

export default useFormatPools;
