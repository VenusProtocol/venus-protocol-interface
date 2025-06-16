import type { Asset } from 'types';
import getCombinedDistributionApys from 'utilities/getCombinedDistributionApys';

export const getBoostedAssetSupplyApy = ({ asset }: { asset: Asset }) => {
  const combinedDistributionApys = getCombinedDistributionApys({ asset });

  const supplyApyPercentage = asset.supplyApyPercentage.plus(
    combinedDistributionApys.totalSupplyApyBoostPercentage,
  );

  return { supplyApyPercentage };
};
