import BigNumber from 'bignumber.js';

import type { LockedDeposit, Vault } from 'types';

import type { Address } from 'viem';
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

export const lockedDeposits: LockedDeposit[] = [
  {
    amountMantissa: new BigNumber('1000000000000000000'),
    unlockedAt: new Date('2022-06-29T10:43:24.000Z'),
  },
  {
    amountMantissa: new BigNumber('2000000000000000000'),
    unlockedAt: new Date('2022-06-30T14:30:04.000Z'),
  },
  {
    amountMantissa: new BigNumber('3000000000000000000'),
    unlockedAt: new Date('2022-07-01T18:16:44.000Z'),
  },
];

export const xvsVaultPoolInfo: {
  stakedTokenAddress: Address;
  allocationPoint: number;
  lastRewardBlock: number;
  accRewardPerShare: BigNumber;
  lockingPeriodMs: number;
} = {
  stakedTokenAddress: xvs.address,
  allocationPoint: 10,
  lastRewardBlock: 100000,
  accRewardPerShare: new BigNumber(123871680),
  lockingPeriodMs: 200000,
};

export const xvsVaultUserInfo: {
  stakedAmountMantissa: BigNumber;
  pendingWithdrawalsTotalAmountMantissa: BigNumber;
  rewardDebtAmountMantissa: BigNumber;
} = {
  stakedAmountMantissa: new BigNumber('30000000000000000000'),
  pendingWithdrawalsTotalAmountMantissa: new BigNumber('1000000000000000000'),
  rewardDebtAmountMantissa: new BigNumber('2000000000000000000'),
};
