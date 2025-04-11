import { BigNumber as BN } from 'ethers';

import type { XvsVault } from 'libs/contracts';

const xvsVaultResponses: {
  poolLength: Awaited<ReturnType<XvsVault['poolLength']>>;
  totalAllocPoints: Awaited<ReturnType<XvsVault['totalAllocPoints']>>;
  rewardTokenAmountsPerBlockOrSecond: Awaited<
    ReturnType<XvsVault['rewardTokenAmountsPerBlockOrSecond']>
  >;
  pendingReward: Awaited<ReturnType<XvsVault['pendingReward']>>;
} = {
  poolLength: BN.from('5'),
  totalAllocPoints: BN.from('100'),
  rewardTokenAmountsPerBlockOrSecond: BN.from('10000000'),
  pendingReward: BN.from('200000000'),
};

export default xvsVaultResponses;
