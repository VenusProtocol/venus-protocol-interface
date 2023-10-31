import { BigNumber } from 'bignumber.js';

import { poolData } from '__mocks__/models/pools';
import { vai, xvs } from '__mocks__/models/tokens';
import { PendingRewardGroup } from 'clients/api/queries/getPendingRewards/types';

export const fakePendingRewardGroups: PendingRewardGroup[] = [
  {
    type: 'mainPool',
    comptrollerAddress: poolData[0].comptrollerAddress,
    rewardToken: xvs,
    rewardAmountWei: new BigNumber('1000000000000000000000000000'),
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
        rewardAmountWei: new BigNumber('2000000000000000000000000000'),
        rewardAmountCents: new BigNumber('300'),
        rewardsDistributorAddress: '0xa14c236372228b6e8182748f3ebbfb4bfeea3574',
        vTokenAddressesWithPendingReward: [
          '0xcfc8a73f9c888eea9af9ccca24646e84a915510b',
          '0x12d3a3aa7f4917ea3b8ee34f99a9a7eec521fa61',
        ],
      },
      {
        rewardToken: xvs,
        rewardAmountWei: new BigNumber('3000000000000000000000000000'),
        rewardAmountCents: new BigNumber('112'),
        rewardsDistributorAddress: '0xadbed07126b7b70cbc5e07bf73599d55be571b9c',
        vTokenAddressesWithPendingReward: ['0xcfc8a73f9c888eea9af9ccca24646e84a915510b'],
      },
    ],
  },
  {
    type: 'vault',
    stakedToken: vai,
    rewardToken: xvs,
    rewardAmountWei: new BigNumber('3000000000000000000000000000'),
    rewardAmountCents: new BigNumber('1200'),
  },
  {
    type: 'xvsVestingVault',
    stakedToken: xvs,
    rewardToken: xvs,
    rewardAmountWei: new BigNumber('4000000000000000000000000000'),
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
        rewardAmountWei: new BigNumber('2000000000000000000000000000'),
        rewardAmountCents: new BigNumber('300'),
      },
      {
        rewardToken: xvs,
        rewardAmountWei: new BigNumber('3000000000000000000000000000'),
        rewardAmountCents: new BigNumber('112'),
      },
    ],
  },
];
