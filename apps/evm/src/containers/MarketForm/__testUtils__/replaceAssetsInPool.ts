import type { Asset, Pool } from 'types';

export const replaceAssetsInPool = (pool: Pool, updatedAssets: Asset[]): Pool => {
  const updatedAssetsByVTokenAddress = new Map(
    updatedAssets.map(asset => [asset.vToken.address.toLowerCase(), asset]),
  );

  const mergedAssets = pool.assets.map(asset => {
    const updatedAsset = updatedAssetsByVTokenAddress.get(asset.vToken.address.toLowerCase());

    if (!updatedAsset) {
      return asset;
    }

    updatedAssetsByVTokenAddress.delete(asset.vToken.address.toLowerCase());

    return updatedAsset;
  });

  return {
    ...pool,
    assets: [...mergedAssets, ...updatedAssetsByVTokenAddress.values()],
  };
};
