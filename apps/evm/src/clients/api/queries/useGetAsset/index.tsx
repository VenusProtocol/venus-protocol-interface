import { useMemo } from 'react';

import { useGetPools } from 'clients/api';
import type { Asset } from 'types';
import { areAddressesEqual } from 'utilities';
import type { Address } from 'viem';

export interface UseGetAssetInput {
  vTokenAddress?: Address;
  accountAddress?: Address;
}

export interface UseGetAssetOutput {
  isLoading: boolean;
  data?: {
    asset?: Asset;
  };
}

export const useGetAsset = ({
  vTokenAddress,
  accountAddress,
}: UseGetAssetInput): UseGetAssetOutput => {
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
