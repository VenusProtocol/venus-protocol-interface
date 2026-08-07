import type { Address } from 'viem';

import type { LiquidityHub, MerklDistribution, Pool } from 'types';
import type { GetPendingRewardsInput } from '../types';

export const getMerklCampaigns = ({
  pools = [],
  liquidityHubs = [],
}: {
  pools?: Pool[];
  liquidityHubs?: LiquidityHub[];
}): {
  isolatedPoolComptrollerAddresses: Address[];
  merklCampaigns: GetPendingRewardsInput['merklCampaigns'];
} => {
  const isolatedPoolComptrollerAddresses: Address[] = [];
  const merklCampaigns: GetPendingRewardsInput['merklCampaigns'] = {};

  for (const pool of pools) {
    if (pool.isIsolated) {
      isolatedPoolComptrollerAddresses.push(pool.comptrollerAddress);
    }

    for (const asset of pool.assets) {
      const assetMerklCampaigns = [
        ...asset.supplyTokenDistributions.filter(d => d.type === 'merkl'),
        ...asset.borrowTokenDistributions.filter(d => d.type === 'merkl'),
      ];

      if (assetMerklCampaigns.length === 0) {
        continue;
      }

      merklCampaigns[asset.vToken.address] = assetMerklCampaigns;
    }
  }

  for (const liquidityHub of liquidityHubs) {
    const liquidityHubMerklCampaigns = liquidityHub.supplyTokenDistributions.reduce<
      MerklDistribution[]
    >((acc, distribution) => {
      if (distribution.type !== 'merkl') {
        return acc;
      }

      return [
        ...acc,
        {
          ...distribution,
          rewardDetails: {
            ...distribution.rewardDetails,
            marketAddress: liquidityHub.vhToken.address,
          },
        },
      ];
    }, []);

    if (liquidityHubMerklCampaigns.length === 0) {
      continue;
    }

    merklCampaigns[liquidityHub.vhToken.address] = liquidityHubMerklCampaigns;
  }

  return {
    isolatedPoolComptrollerAddresses,
    merklCampaigns,
  };
};
