import { useMemo } from 'react';
import { Asset } from 'types';
import { areAddressesEqual } from 'utilities';

import { useGetPools } from 'clients/api';

export interface UseGetAssetInput {
  vTokenAddress?: string;
  accountAddress?: string;
}

export interface UseGetAssetOutput {
  isLoading: boolean;
  data?: {
    asset?: Asset;
  };
}

const useGetAsset = ({ vTokenAddress, accountAddress }: UseGetAssetInput): UseGetAssetOutput => {
  const { data: getPoolsData, isLoading } = useGetPools({
    accountAddress,
  });

  const asset = useMemo(() => {
    if (!getPoolsData?.pools || !vTokenAddress) {
      return undefined;
    }

    let matchingAsset: Asset | undefined;

    for (let p = 0; p < getPoolsData.pools.length; p++) {
      const pool = getPoolsData.pools[p];

      matchingAsset = pool.assets.find(poolAsset =>
        areAddressesEqual(poolAsset.vToken.address, vTokenAddress),
      );

      // Break loop if we find a matching asset
      if (matchingAsset) {
        break;
      }
    }

    return matchingAsset;
  }, [vTokenAddress, getPoolsData?.pools]);

  return {
    isLoading,
    data: getPoolsData?.pools && {
      asset,
    },
  };
};

export default useGetAsset;
