import { BigNumber } from 'bignumber.js';

import { PendingRewardGroup } from 'clients/api/queries/getPendingRewards/types';
import { TESTNET_TOKENS, TESTNET_VBEP_TOKENS } from 'constants/tokens';

export const fakePendingRewardGroups: PendingRewardGroup[] = [
  {
    type: 'pool',
    comptrollerAddress: '0x94d1820b2D1c7c7452A163983Dc888CEC546b77D',
    pendingRewards: [
      {
        rewardToken: TESTNET_TOKENS.xvs,
        rewardAmountWei: new BigNumber('1000000000000000000000000000'),
        vTokenAddressesWithPendingReward: [
          TESTNET_VBEP_TOKENS.usdc.address,
          TESTNET_VBEP_TOKENS.usdt.address,
          TESTNET_VBEP_TOKENS.busd.address,
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
