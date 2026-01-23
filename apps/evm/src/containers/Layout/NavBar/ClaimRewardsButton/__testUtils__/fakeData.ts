import { BigNumber } from 'bignumber.js';

import { poolData } from '__mocks__/models/pools';
import { bnb, usdt, vai, xvs } from '__mocks__/models/tokens';

import type { PendingRewardGroup } from 'clients/api/queries/getPendingRewards/types';

export const fakePendingRewardGroups: PendingRewardGroup[] = [
  {
    type: 'legacyPool',
    comptrollerAddress: poolData[0].comptrollerAddress,
    rewardToken: xvs,
    rewardAmountMantissa: new BigNumber('1000000000000000000000000000'),
    rewardAmountCents: new BigNumber('40000000'),
    vTokenAddressesWithPendingReward: [
      '0xD5C4C2e2facBEB59D0216D0595d63FcDc6F9A1a7',
      '0xb7526572FFE56AB9D7489838Bf2E18e3323b441A',
      '0x08e0A5575De71037aE36AbfAfb516595fE68e5e4',
    ],
  },
  {
    type: 'isolatedPool',
    comptrollerAddress: poolData[1].comptrollerAddress,
    pendingRewards: [
      {
        rewardToken: vai,
        rewardAmountMantissa: new BigNumber('2000000000000000000000000000'),
        rewardAmountCents: new BigNumber('300'),
        rewardsDistributorAddress: '0xa14c236372228b6e8182748f3ebbfb4bfeea3574',
        vTokenAddressesWithPendingReward: [
          '0xcfc8a73f9c888eea9af9ccca24646e84a915510b',
          '0x12d3a3aa7f4917ea3b8ee34f99a9a7eec521fa61',
        ],
      },
      {
        rewardToken: xvs,
        rewardAmountMantissa: new BigNumber('3000000000000000000000000000'),
        rewardAmountCents: new BigNumber('112'),
        rewardsDistributorAddress: '0xadbed07126b7b70cbc5e07bf73599d55be571b9c',
        vTokenAddressesWithPendingReward: ['0xcfc8a73f9c888eea9af9ccca24646e84a915510b'],
      },
    ],
  },
  {
    type: 'vault',
    isDisabled: false,
    stakedToken: vai,
    rewardToken: xvs,
    rewardAmountMantissa: new BigNumber('3000000000000000000000000000'),
    rewardAmountCents: new BigNumber('1200'),
  },
  {
    type: 'xvsVestingVault',
    isDisabled: false,
    stakedToken: xvs,
    rewardToken: xvs,
    rewardAmountMantissa: new BigNumber('4000000000000000000000000000'),
    rewardAmountCents: new BigNumber('165'),
    poolIndex: 0,
  },
  {
    type: 'prime',
    isDisabled: false,
    vTokenAddressesWithPendingReward: [
      '0xcfc8a73f9c888eea9af9ccca24646e84a915510b',
      '0x12d3a3aa7f4917ea3b8ee34f99a9a7eec521fa61',
    ],
    pendingRewards: [
      {
        rewardToken: vai,
        rewardAmountMantissa: new BigNumber('2000000000000000000000000000'),
        rewardAmountCents: new BigNumber('300'),
      },
      {
        rewardToken: xvs,
        rewardAmountMantissa: new BigNumber('3000000000000000000000000000'),
        rewardAmountCents: new BigNumber('112'),
      },
    ],
  },
  {
    type: 'external',
    appName: 'Mock App',
    campaignName: 'Mock campaign',
    claimUrl: 'http://mock.app',
    pendingRewards: [
      {
        appName: 'Mock App',
        campaignName: 'Mock campaign',
        claimUrl: 'http://mock.app',
        rewardAmountCents: new BigNumber('700'),
        rewardAmountMantissa: new BigNumber('1000000000000000000000000000'),
        rewardToken: bnb,
      },
    ],
  },
  {
    type: 'external',
    appName: 'Mock App 2',
    campaignName: 'Mock campaign 2',
    claimUrl: 'http://mock2.app',
    pendingRewards: [
      {
        appName: 'Mock App 2',
        campaignName: 'Mock campaign 2',
        claimUrl: 'http://mock2.app',
        rewardAmountCents: new BigNumber('123'),
        rewardAmountMantissa: new BigNumber('12300000000'),
        rewardToken: usdt,
      },
    ],
  },
];
