import { BigNumber as BN } from 'ethers';

import type { XvsVault } from 'libs/contracts';

const xvsVaultResponses: {
  userInfo: Awaited<ReturnType<XvsVault['getUserInfo']>>;
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
  poolLength: BN.from('5'),
  totalAllocPoints: BN.from('100'),
  rewardTokenAmountsPerBlockOrSecond: BN.from('10000000'),
  pendingReward: BN.from('200000000'),
};

export default xvsVaultResponses;
