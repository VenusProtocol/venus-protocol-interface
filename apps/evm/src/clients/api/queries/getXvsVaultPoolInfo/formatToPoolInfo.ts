import BigNumber from 'bignumber.js';

import type { XvsVault } from 'libs/contracts';

import type { GetXvsVaultPoolInfoOutput } from './types';

const formatToUserInfo = ({
  token,
  allocPoint,
  lastRewardBlockOrSecond,
  accRewardPerShare,
  lockPeriod,
}: Awaited<ReturnType<XvsVault['poolInfos']>>): GetXvsVaultPoolInfoOutput => ({
  stakedTokenAddress: token,
  allocationPoint: allocPoint.toNumber(),
  // TODO: handle time based rates
  lastRewardBlock: lastRewardBlockOrSecond.toNumber(),
  accRewardPerShare: new BigNumber(accRewardPerShare.toString()),
  // Convert lockPeriod from seconds to milliseconds
  lockingPeriodMs: lockPeriod.toNumber() * 1000,
});

export default formatToUserInfo;
