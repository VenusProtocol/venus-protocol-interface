import type { Address } from 'viem';

import { useGetPools, useGetRawYieldPlusPositions } from 'clients/api';
import { NULL_ADDRESS } from 'constants/address';
import type { Asset, Pool, YieldPlusPosition } from 'types';
import { areTokensEqual } from 'utilities';

export const useGetYieldPlusPositions = ({ accountAddress }: { accountAddress?: Address }) => {
  const { data: getRawYieldPlusPositions, isLoading: isGetRawYieldPlusPositionsLoading } =
    useGetRawYieldPlusPositions(
      {
        accountAddress: accountAddress || NULL_ADDRESS,
      },
      {
        enabled: !!accountAddress,
      },
    );

  const rawYieldPlusPositions = getRawYieldPlusPositions?.positions || [];

  const { data: getPoolsData, isLoading: isGetPoolsLoading } = useGetPools({
    accountAddress,
  });

  const assetMapping: Record<Address, Asset> = {};

  (getPoolsData?.pools || []).forEach(pool =>
    pool.assets.forEach(asset => {
      assetMapping[asset.vToken.address.toLowerCase() as Address] = asset;
    }),
  );

  // Enrich raw Yield+ positions with user wallet balances
  const positions: YieldPlusPosition[] = rawYieldPlusPositions.map(rawYieldPlusPosition => {
    const pool: Pool = {
      ...rawYieldPlusPosition.pool,
      assets: rawYieldPlusPosition.pool.assets.map(asset => {
        const sanitizedVTokenAddress = asset.vToken.address.toLowerCase() as Address;

        return {
          ...asset,
          userWalletBalanceTokens:
            assetMapping[sanitizedVTokenAddress]?.userWalletBalanceTokens ||
            asset.userWalletBalanceTokens,
          userWalletBalanceCents:
            assetMapping[sanitizedVTokenAddress]?.userWalletBalanceCents ||
            asset.userWalletBalanceCents,
        };
      }),
    };

    const dsaAsset: Asset =
      pool.assets.find(asset =>
        areTokensEqual(asset.vToken, rawYieldPlusPosition.dsaAsset.vToken),
      ) || rawYieldPlusPosition.dsaAsset;

    const shortAsset: Asset =
      pool.assets.find(asset =>
        areTokensEqual(asset.vToken, rawYieldPlusPosition.shortAsset.vToken),
      ) || rawYieldPlusPosition.shortAsset;

    const longAsset: Asset =
      pool.assets.find(asset =>
        areTokensEqual(asset.vToken, rawYieldPlusPosition.longAsset.vToken),
      ) || rawYieldPlusPosition.longAsset;

    return {
      ...rawYieldPlusPosition,
      dsaAsset,
      shortAsset,
      longAsset,
      pool,
    };
  });

  const isLoading = isGetRawYieldPlusPositionsLoading || isGetPoolsLoading;

  return {
    data: {
      positions,
    },
    isLoading,
  };
};
