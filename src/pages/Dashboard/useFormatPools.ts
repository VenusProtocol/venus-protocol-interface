import { useMemo } from 'react';
import { Asset, Pool } from 'types';

const isAssetInSearch = ({ asset, searchValue }: { asset: Asset; searchValue: string }) => {
  const lowerCasedSearchValue = searchValue.toLowerCase();
  return asset.vToken.underlyingToken.symbol.toLowerCase().includes(lowerCasedSearchValue);
};

const useFormatPools = ({
  pools,
  searchValue,
  selectedPoolName,
}: {
  pools: Pool[];
  searchValue: string;
  selectedPoolName?: string;
}) => {
  const formattedPools = useMemo(() => {
    const filteredPools = selectedPoolName
      ? pools.filter(pool => pool.name === selectedPoolName)
      : pools;

    if (!searchValue) {
      return filteredPools;
    }

    return filteredPools.map(pool => ({
      ...pool,
      assets: pool.assets.filter(asset =>
        isAssetInSearch({
          asset,
          searchValue,
        }),
      ),
    }));
  }, [pools, searchValue, selectedPoolName]);

  return formattedPools;
};

export default useFormatPools;
