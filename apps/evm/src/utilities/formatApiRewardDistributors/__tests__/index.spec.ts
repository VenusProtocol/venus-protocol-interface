import { xvs } from '__mocks__/models/tokens';
import type { ApiIntrinsicApyReward, ApiMerklReward, ApiVenusReward } from 'types';

import { formatApiRewardDistributors } from '..';

const marketAddress = '0x1000000000000000000000000000000000000001';
const rewardsDistributorContractAddress = '0x2000000000000000000000000000000000000001';

const apiVenusRewardDistributor: ApiVenusReward = {
  marketAddress,
  rewardTokenAddress: xvs.address,
  lastRewardingSupplyBlockOrTimestamp: '0',
  lastRewardingBorrowBlockOrTimestamp: '0',
  supplySpeed: '10000000000000000',
  borrowSpeed: '20000000000000000',
  supplyApyRatio: '0.01',
  borrowApyRatio: '0.02',
  priceMantissa: '2000000000000000000',
  rewardsDistributorContractAddress,
  isActive: true,
  rewardType: 'venus',
  rewardDetails: null,
};

describe('formatApiRewardDistributors', () => {
  it('uses the API reward APY ratios', () => {
    const { supplyTokenDistributions, borrowTokenDistributions } = formatApiRewardDistributors({
      apiRewardDistributors: [apiVenusRewardDistributor],
      tokens: [xvs],
      blocksPerDay: 1,
      currentBlockNumber: 1n,
    });

    expect(supplyTokenDistributions[0].apyPercentage.toFixed()).toBe('1');
    expect(borrowTokenDistributions[0].apyPercentage.toFixed()).toBe('2');
  });

  it('filters out unknown reward tokens', () => {
    const { supplyTokenDistributions, borrowTokenDistributions } = formatApiRewardDistributors({
      apiRewardDistributors: [apiVenusRewardDistributor],
      tokens: [],
      blocksPerDay: 1,
      currentBlockNumber: 1n,
    });

    expect(supplyTokenDistributions).toHaveLength(0);
    expect(borrowTokenDistributions).toHaveLength(0);
  });

  it('creates supply and borrow distributions from reward speeds', () => {
    const { supplyTokenDistributions, borrowTokenDistributions } = formatApiRewardDistributors({
      apiRewardDistributors: [apiVenusRewardDistributor],
      tokens: [xvs],
      blocksPerDay: 1,
      currentBlockNumber: 1n,
    });

    const [supplyDistribution] = supplyTokenDistributions;
    const [borrowDistribution] = borrowTokenDistributions;

    expect(supplyTokenDistributions).toHaveLength(1);
    expect(borrowTokenDistributions).toHaveLength(1);

    if (!('dailyDistributedTokens' in supplyDistribution)) {
      throw new Error('expected supply token distribution');
    }

    if (!('dailyDistributedTokens' in borrowDistribution)) {
      throw new Error('expected borrow token distribution');
    }

    expect(supplyDistribution.dailyDistributedTokens.toFixed()).toBe('0.01');
    expect(borrowDistribution.dailyDistributedTokens.toFixed()).toBe('0.02');
  });

  it('preserves Merkl and generic reward details', () => {
    const apiMerklRewardDistributor: ApiMerklReward = {
      ...apiVenusRewardDistributor,
      rewardType: 'merkl',
      borrowSpeed: '0',
      rewardDetails: {
        appName: 'Merkl',
        claimUrl: 'https://example.com/claim',
        merklCampaignId: 'campaign-id',
        description: 'Merkl rewards',
        merklCampaignIdentifier: 'campaign-identifier',
        tags: ['tag'],
      },
    };
    const apiIntrinsicRewardDistributor: ApiIntrinsicApyReward = {
      ...apiVenusRewardDistributor,
      rewardType: 'intrinsic',
      borrowSpeed: '0',
      rewardDetails: {
        name: 'Intrinsic APY',
        description: 'Intrinsic rewards',
      },
    };

    const { supplyTokenDistributions } = formatApiRewardDistributors({
      apiRewardDistributors: [apiMerklRewardDistributor, apiIntrinsicRewardDistributor],
      tokens: [xvs],
      blocksPerDay: 1,
      currentBlockNumber: 1n,
    });

    expect(supplyTokenDistributions[0]).toMatchObject({
      type: 'merkl',
      rewardDetails: {
        appName: 'Merkl',
        claimUrl: 'https://example.com/claim',
        marketAddress,
        merklCampaignId: 'campaign-id',
        merklCampaignIdentifier: 'campaign-identifier',
        description: 'Merkl rewards',
        tags: ['tag'],
      },
    });
    expect(supplyTokenDistributions[1]).toMatchObject({
      type: 'intrinsic',
      rewardDetails: {
        name: 'Intrinsic APY',
        description: 'Intrinsic rewards',
      },
    });
  });
});
