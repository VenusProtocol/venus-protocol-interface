import BigNumber from 'bignumber.js';
import { Vault } from 'types';

import { vai, xvs } from './tokens';

export const vaults: Vault[] = [
  {
    rewardToken: xvs,
    stakedToken: vai,
    lockingPeriodMs: 300000,
    dailyEmissionWei: new BigNumber('144000000000000000000'),
    totalStakedWei: new BigNumber('415000000000000000000'),
    stakingAprPercentage: 12665.060240963856,
  },
  {
    rewardToken: xvs,
    stakedToken: xvs,
    lockingPeriodMs: 300000,
    dailyEmissionWei: new BigNumber('144000000000000000000'),
    totalStakedWei: new BigNumber('400000000000000000000000000'),
    stakingAprPercentage: 12.92281835063781,
    userStakedWei: new BigNumber('233000000000000000000'),
  },
];
