import BigNumber from 'bignumber.js';

import { XvsVault } from 'types/contracts';

import { GetXvsVaultPoolInfoOutput } from './types';

const formatToUserInfo = ({
  token,
  allocPoint,
  lastRewardBlock,
  accRewardPerShare,
  lockPeriod,
}: Awaited<
  ReturnType<ReturnType<XvsVault['methods']['poolInfos']>['call']>
>): GetXvsVaultPoolInfoOutput => ({
  stakedTokenAddress: token,
  allocationPoint: +allocPoint,
  lastRewardBlock: +lastRewardBlock,
  accRewardPerShare: new BigNumber(accRewardPerShare),
  // Convert lockPeriod from seconds to milliseconds
  lockingPeriodMs: +lockPeriod * 1000,
});

export default formatToUserInfo;
