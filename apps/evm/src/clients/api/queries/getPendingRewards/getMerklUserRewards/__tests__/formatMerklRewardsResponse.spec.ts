import BigNumber from 'bignumber.js';
import { ChainId, type MerklDistribution } from 'types';
import type { Address } from 'viem';
import type { GetMerklUserRewardsResponse } from '..';
import { formatMerklRewardsPayload } from '../formatMerklRewardsResponse';

const CAMPAIGN_ID = '0xf9c2033a2265347f4c7125cd527541997ec2a6411b75dedc7d1ffa609d2933c6';
const V_U: Address = '0x3d5E269787d562b74aCC55F18Bd26C5D09Fa245E';
const V_USDT: Address = '0xfD5840Cd36d94D7229439859C0112a4185BC0255';
const USDT_ADDRESS: Address = '0x55d398326f99059fF775485246999027B3197955';

const buildDistribution = (marketAddress: Address): MerklDistribution => ({
  type: 'merkl',
  token: {
    chainId: ChainId.BSC_MAINNET,
    address: USDT_ADDRESS,
    decimals: 18,
    symbol: 'USDT',
    iconSrc: '/src/libs/tokens/img/underlyingTokens/usdt.svg',
  },
  apyPercentage: new BigNumber('6.31'),
  dailyDistributedTokens: new BigNumber(0),
  isActive: true,
  rewardDetails: {
    tags: ['venus'],
    appName: 'Merkl',
    claimUrl: 'https://app.merkl.xyz/users/',
    description: 'Merkl campaign',
    merklCampaignIdentifier: CAMPAIGN_ID,
    marketAddress,
  },
});

const apiPayload: GetMerklUserRewardsResponse = [
  {
    rewards: [
      {
        root: '0x0',
        recipient: '0xc322Bc5C997Fa321C7ed71DB7aF11A8dE475271D',
        amount: '12844275000000000000',
        token: {
          address: USDT_ADDRESS,
          chainId: 56,
          symbol: 'USDT',
          decimals: 18,
        },
        breakdowns: [
          {
            tokenAddress: USDT_ADDRESS,
            reason: 'ERC20',
            amount: '12844275000000000000',
            claimed: '0',
            pending: '1397349000000000000',
            campaignId: CAMPAIGN_ID,
          },
        ],
      },
    ],
  },
];

describe('formatMerklRewardsPayload', () => {
  it('counts a campaign once when it covers several markets', () => {
    const result = formatMerklRewardsPayload(apiPayload, {
      [V_U]: [buildDistribution(V_U)],
      [V_USDT]: [buildDistribution(V_USDT)],
    });

    expect(result).toHaveLength(1);
    expect(result[0].pendingRewards).toHaveLength(1);
    expect(result[0].pendingRewards[0].amountMantissa.toFixed()).toBe('12844275000000000000');
  });

  it('still reports the reward when the campaign covers a single market', () => {
    const result = formatMerklRewardsPayload(apiPayload, {
      [V_USDT]: [buildDistribution(V_USDT)],
    });

    expect(result[0].pendingRewards).toHaveLength(1);
    expect(result[0].pendingRewards[0].amountMantissa.toFixed()).toBe('12844275000000000000');
  });
});
