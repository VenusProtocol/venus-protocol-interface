import BigNumber from 'bignumber.js';

import { XvsVault } from 'types/contracts';
import { IGetXvsVaultPoolInfoOutput } from './types';

const formatToUserInfo = ({
  token,
  allocPoint,
  lastRewardBlock,
  accRewardPerShare,
  lockPeriod,
}: Awaited<
  ReturnType<ReturnType<XvsVault['methods']['poolInfos']>['call']>
>): IGetXvsVaultPoolInfoOutput => ({
  stakedTokenAddress: token,
  allocationPoint: +allocPoint,
  lastRewardBlock: +lastRewardBlock,
  accRewardPerShare: new BigNumber(accRewardPerShare),
  // Convert lockPeriod from seconds to milliseconds
  lockingPeriodMs: +lockPeriod * 1000,
});

export default formatToUserInfo;
