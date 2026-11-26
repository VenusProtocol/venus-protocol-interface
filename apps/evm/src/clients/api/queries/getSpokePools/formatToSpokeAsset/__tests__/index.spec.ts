import spokePoolsResponse from '__mocks__/api/spokePools.json';
import { usdc, usdt } from '__mocks__/models/tokens';
import type { GetSpokePoolsResponse } from 'clients/api/queries/getSpokePools/types';
import { getUnixTime } from 'date-fns/getUnixTime';
import { type ApiMerklReward, ChainId, type Token } from 'types';

import { formatToSpokeAsset } from '..';

const { result: apiPools = [] } = spokePoolsResponse as GetSpokePoolsResponse;
const apiMarket = apiPools[0].markets[0];

const tslab: Token = {
  ...usdc,
  address: '0x0000000000000000000000000000000000007514',
  decimals: 18,
  symbol: 'TSLAB',
};

const buildMerklBorrowReward = (overrides: Partial<ApiMerklReward> = {}): ApiMerklReward => ({
  marketAddress: apiMarket.address,
  rewardTokenAddress: usdt.address,
  lastRewardingSupplyBlockOrTimestamp: '-1',
  lastRewardingBorrowBlockOrTimestamp: String(getUnixTime(new Date()) + 86400),
  supplySpeed: '0',
  borrowSpeed: '1000000000000',
  supplyApyRatio: '0',
  borrowApyRatio: '0.0865',
  priceMantissa: '1000000000000000000',
  rewardsDistributorContractAddress: '0x0000000000000000000000000000000000000001',
  isActive: true,
  rewardType: 'merkl',
  rewardDetails: {
    appName: 'Merkl',
    claimUrl: 'https://app.merkl.xyz/users/',
    merklCampaignId: 'campaign',
    description: 'Merkl campaign',
    merklCampaignIdentifier: '0xcampaign',
    tags: ['venus'],
    apr: 8.65,
    eligibleBorrowMarketAddresses: [apiMarket.address],
  },
  ...overrides,
});

const format = (overrides: Partial<typeof apiMarket>, token: Token) =>
  formatToSpokeAsset({
    apiMarket: { ...apiMarket, underlyingAddress: token.address, ...overrides },
    chainId: ChainId.BSC_TESTNET,
    tokens: [token, usdt],
    currentBlockNumber: BigInt(spokePoolsResponse.blockNumber),
    isUserConnected: false,
    userTokenBalances: [],
    isUserWhitelisted: false,
  });

describe('formatToSpokeAsset', () => {
  it('computes the total supply exactly as the comptroller supply cap check does', () => {
    // Testnet vTSLAB_HubSpoke, where MAX overshot the cap
    const asset = format(
      {
        totalSupplyMantissa: '301598374995',
        exchangeRateMantissa: '10000000000076097982899876333',
        supplyCapsMantissa: '10000000000000000000000',
      },
      tslab,
    );

    expect(asset?.supplyBalanceTokens.toFixed()).toBe('3015.983749972951027982');
    expect(asset?.supplyCapTokens.minus(asset.supplyBalanceTokens).toFixed()).toBe(
      '6984.016250027048972018',
    );
  });

  it('never carries more decimals than the underlying token supports', () => {
    const asset = format(
      {
        totalSupplyMantissa: '1698597054466',
        exchangeRateMantissa: '10000000000004000000',
      },
      usdc,
    );

    expect(asset?.supplyBalanceTokens.decimalPlaces()).toBeLessThanOrEqual(usdc.decimals);
  });

  it('has no reward distributions when the market has no campaign', () => {
    const asset = format({ rewardsDistributors: [] }, usdc);

    expect(asset?.supplyTokenDistributions).toEqual([]);
    expect(asset?.borrowTokenDistributions).toEqual([]);
  });

  it('carries a non-gated Merkl borrow campaign as an active borrow distribution', () => {
    const asset = format({ rewardsDistributors: [buildMerklBorrowReward()] }, usdc);

    expect(asset?.supplyTokenDistributions).toEqual([]);
    expect(asset?.borrowTokenDistributions).toHaveLength(1);
    expect(asset?.borrowTokenDistributions[0]).toMatchObject({
      type: 'merkl',
      isActive: true,
      token: usdt,
    });
    expect(asset?.borrowTokenDistributions[0].apyPercentage.toFixed()).toBe('8.65');
    expect(asset?.borrowTokenDistributions[0]).not.toHaveProperty('collateralGate');
  });

  it('marks an ended Merkl borrow campaign as inactive', () => {
    const asset = format(
      {
        rewardsDistributors: [
          buildMerklBorrowReward({
            lastRewardingBorrowBlockOrTimestamp: String(getUnixTime(new Date()) - 86400),
          }),
        ],
      },
      usdc,
    );

    expect(asset?.borrowTokenDistributions[0].isActive).toBe(false);
  });
});
