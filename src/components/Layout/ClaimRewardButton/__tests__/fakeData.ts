import { BigNumber } from 'bignumber.js';

import { PendingRewardGroup } from 'clients/api/queries/getPendingRewards/types';
import { TESTNET_TOKENS } from 'constants/tokens';

export const fakePendingRewardGroups: PendingRewardGroup[] = [
  {
    type: 'mainPool',
    comptrollerAddress: 'fake-comptroller-address-1',
    rewardToken: TESTNET_TOKENS.xvs,
    rewardAmountWei: new BigNumber('1000000000000000000000000000'),
    vTokenAddressesWithPendingReward: [
      '0xD5C4C2e2facBEB59D0216D0595d63FcDc6F9A1a7',
      '0xb7526572FFE56AB9D7489838Bf2E18e3323b441A',
      '0x08e0A5575De71037aE36AbfAfb516595fE68e5e4',
    ],
  },
  {
    type: 'isolatedPool',
    comptrollerAddress: 'fake-comptroller-address-2',
    pendingRewards: [
      {
        rewardToken: TESTNET_TOKENS.vai,
        rewardAmountWei: new BigNumber('2000000000000000000000000000'),
        rewardsDistributorAddress: '0xa14c236372228b6e8182748f3ebbfb4bfeea3574',
        vTokenAddressesWithPendingReward: [
          '0xcfc8a73f9c888eea9af9ccca24646e84a915510b',
          '0x12d3a3aa7f4917ea3b8ee34f99a9a7eec521fa61',
        ],
      },
      {
        rewardToken: TESTNET_TOKENS.xvs,
        rewardAmountWei: new BigNumber('3000000000000000000000000000'),
        rewardsDistributorAddress: '0xadbed07126b7b70cbc5e07bf73599d55be571b9c',
        vTokenAddressesWithPendingReward: ['0xcfc8a73f9c888eea9af9ccca24646e84a915510b'],
      },
    ],
  },
  {
    type: 'vault',
    stakedToken: TESTNET_TOKENS.vrt,
    rewardToken: TESTNET_TOKENS.vrt,
    rewardAmountWei: new BigNumber('2000000000000000000000000000'),
  },
  {
    type: 'vault',
    stakedToken: TESTNET_TOKENS.vai,
    rewardToken: TESTNET_TOKENS.xvs,
    rewardAmountWei: new BigNumber('3000000000000000000000000000'),
  },
  {
    type: 'xvsVestingVault',
    rewardToken: TESTNET_TOKENS.xvs,
    rewardAmountWei: new BigNumber('4000000000000000000000000000'),
    poolIndex: 0,
  },
];
