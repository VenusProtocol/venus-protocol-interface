import BigNumber from 'bignumber.js';

import type { Vault } from 'types';

import { vai, xvs } from './tokens';

export const vaults: Vault[] = [
  {
    rewardToken: xvs,
    stakedToken: vai,
    isPaused: false,
    lockingPeriodMs: 300000,
    dailyEmissionMantissa: new BigNumber('144000000000000000000'),
    totalStakedMantissa: new BigNumber('415000000000000000000'),
    stakingAprPercentage: 12665.060240963856,
  },
  {
    rewardToken: xvs,
    stakedToken: xvs,
    isPaused: false,
    lockingPeriodMs: 300000,
    dailyEmissionMantissa: new BigNumber('144000000000000000000'),
    totalStakedMantissa: new BigNumber('400000000000000000000000000'),
    stakingAprPercentage: 12.92281835063781,
    userStakedMantissa: new BigNumber('233000000000000000000'),
  },
];
