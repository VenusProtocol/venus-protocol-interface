import type { Address } from 'viem';

import { useGetPools, useGetRawTradePositions } from 'clients/api';
import { NULL_ADDRESS } from 'constants/address';
import type { Asset, Pool, TradePosition } from 'types';
import { areTokensEqual } from 'utilities';

export const useGetTradePositions = ({ accountAddress }: { accountAddress?: Address }) => {
  const { data: getRawTradePositions, isLoading: isGetRawTradePositionsLoading } =
    useGetRawTradePositions(
      {
        accountAddress: accountAddress || NULL_ADDRESS,
      },
      {
        enabled: !!accountAddress,
      },
    );

  const rawTradePositions = getRawTradePositions?.positions || [];

  const { data: getPoolsData, isLoading: isGetPoolsLoading } = useGetPools({
    accountAddress,
  });

  const assetMapping: Record<Address, Asset> = {};

  (getPoolsData?.pools || []).forEach(pool =>
    pool.assets.forEach(asset => {
      assetMapping[asset.vToken.address.toLowerCase() as Address] = asset;
    }),
  );

  // Enrich raw Trade positions with user wallet balances
  const positions: TradePosition[] = rawTradePositions.map(rawTradePosition => {
    const pool: Pool = {
      ...rawTradePosition.pool,
      assets: rawTradePosition.pool.assets.map(asset => {
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
      pool.assets.find(asset => areTokensEqual(asset.vToken, rawTradePosition.dsaAsset.vToken)) ||
      rawTradePosition.dsaAsset;

    const shortAsset: Asset =
      pool.assets.find(asset => areTokensEqual(asset.vToken, rawTradePosition.shortAsset.vToken)) ||
      rawTradePosition.shortAsset;

    const longAsset: Asset =
      pool.assets.find(asset => areTokensEqual(asset.vToken, rawTradePosition.longAsset.vToken)) ||
      rawTradePosition.longAsset;

    return {
      ...rawTradePosition,
      dsaAsset,
      shortAsset,
      longAsset,
      pool,
    };
  });

  const isLoading = isGetRawTradePositionsLoading || isGetPoolsLoading;

  return {
    data: {
      positions,
    },
    isLoading,
  };
};
