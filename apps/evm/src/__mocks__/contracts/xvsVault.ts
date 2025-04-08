import { BigNumber as BN } from 'ethers';

import type { XvsVault } from 'libs/contracts';

import { xvs } from '../models/tokens';

const xvsVaultResponses: {
  userInfo: Awaited<ReturnType<XvsVault['getUserInfo']>>;
  poolInfo: Awaited<ReturnType<XvsVault['poolInfos']>>;
  poolLength: Awaited<ReturnType<XvsVault['poolLength']>>;
  totalAllocPoints: Awaited<ReturnType<XvsVault['totalAllocPoints']>>;
  rewardTokenAmountsPerBlockOrSecond: Awaited<
    ReturnType<XvsVault['rewardTokenAmountsPerBlockOrSecond']>
  >;
  pendingReward: Awaited<ReturnType<XvsVault['pendingReward']>>;
} = {
  userInfo: {
    pendingWithdrawals: BN.from('1000000000000000000'),
    rewardDebt: BN.from('2000000000000000000'),
    amount: BN.from('30000000000000000000'),
  } as Awaited<ReturnType<XvsVault['getUserInfo']>>,
  poolInfo: {
    token: xvs.address,
    allocPoint: BN.from('10'),
    lastRewardBlockOrSecond: BN.from('100000'),
    accRewardPerShare: BN.from('123871680'),
    lockPeriod: BN.from('200'),
  } as Awaited<ReturnType<XvsVault['poolInfos']>>,
  poolLength: BN.from('5'),
  totalAllocPoints: BN.from('100'),
  rewardTokenAmountsPerBlockOrSecond: BN.from('10000000'),
  pendingReward: BN.from('200000000'),
};

export default xvsVaultResponses;
