import BigNumber from 'bignumber.js';

import { Vault } from 'types';

export const vaults: Vault[] = [
  {
    rewardTokenId: 'xvs',
    stakedTokenId: 'vai',
    lockingPeriodMs: 300000,
    dailyEmissionWei: new BigNumber('144000000000000000000'),
    totalStakedWei: new BigNumber('415000000000000000000'),
    stakingAprPercentage: 12665.060240963856,
  },
  {
    rewardTokenId: 'xvs',
    stakedTokenId: 'xvs',
    lockingPeriodMs: 300000,
    dailyEmissionWei: new BigNumber('144000000000000000000'),
    totalStakedWei: new BigNumber('400000000000000000000000000'),
    stakingAprPercentage: 12.92281835063781,
  },
];
