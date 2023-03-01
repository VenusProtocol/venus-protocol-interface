import { BigNumber } from 'bignumber.js';

import { PendingRewardGroup } from 'clients/api/queries/getPendingRewards/types';
import { TESTNET_TOKENS } from 'constants/tokens';

export const fakePendingRewardGroups: PendingRewardGroup[] = [
  {
    type: 'pool',
    comptrollerAddress: '0x94d1820b2D1c7c7452A163983Dc888CEC546b77D',
    pendingRewards: [
      {
        rewardToken: TESTNET_TOKENS.xvs,
        rewardAmountWei: new BigNumber('1000000000000000000000000000'),
        vTokenAddressesWithPendingReward: [
          '0xD5C4C2e2facBEB59D0216D0595d63FcDc6F9A1a7',
          '0xb7526572FFE56AB9D7489838Bf2E18e3323b441A',
          '0x08e0A5575De71037aE36AbfAfb516595fE68e5e4',
        ],
      },
    ],
  },
  {
    type: 'vault',
    stakedToken: TESTNET_TOKENS.vrt,
    rewardToken: TESTNET_TOKENS.vrt,
    rewardAmountWei: new BigNumber('1000000000000000000000000000'),
  },
  {
    type: 'vault',
    stakedToken: TESTNET_TOKENS.vai,
    rewardToken: TESTNET_TOKENS.xvs,
    rewardAmountWei: new BigNumber('1000000000000000000000000000'),
  },
  {
    type: 'vestingVault',
    stakedToken: TESTNET_TOKENS.xvs,
    rewardToken: TESTNET_TOKENS.xvs,
    rewardAmountWei: new BigNumber('1000000000000000000000000000'),
  },
];
