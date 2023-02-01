import BigNumber from 'bignumber.js';

import { XvsVault } from 'types/contracts';

import { GetXvsVaultPoolInfoOutput } from './types';

const formatToUserInfo = ({
  token,
  allocPoint,
  lastRewardBlock,
  accRewardPerShare,
  lockPeriod,
}: Awaited<ReturnType<XvsVault['poolInfos']>>): GetXvsVaultPoolInfoOutput => ({
  stakedTokenAddress: token,
  allocationPoint: allocPoint.toNumber(),
  lastRewardBlock: lastRewardBlock.toNumber(),
  accRewardPerShare: new BigNumber(accRewardPerShare.toString()),
  // Convert lockPeriod from seconds to milliseconds
  lockingPeriodMs: lockPeriod.toNumber() * 1000,
});

export default formatToUserInfo;
