import { BigNumber as BN } from 'ethers';
import { ContractTypeByName } from 'packages/contracts';

import { xvs } from '../models/tokens';

const xvsVaultResponses: {
  userInfo: Awaited<ReturnType<ContractTypeByName<'xvsVault'>['getUserInfo']>>;
  poolInfo: Awaited<ReturnType<ContractTypeByName<'xvsVault'>['poolInfos']>>;
  poolLength: Awaited<ReturnType<ContractTypeByName<'xvsVault'>['poolLength']>>;
  totalAllocPoints: Awaited<ReturnType<ContractTypeByName<'xvsVault'>['totalAllocPoints']>>;
  rewardTokenAmountsPerBlock: Awaited<
    ReturnType<ContractTypeByName<'xvsVault'>['rewardTokenAmountsPerBlock']>
  >;
  pendingReward: Awaited<ReturnType<ContractTypeByName<'xvsVault'>['pendingReward']>>;
  getWithdrawalRequests: Awaited<
    ReturnType<ContractTypeByName<'xvsVault'>['getWithdrawalRequests']>
  >;
} = {
  userInfo: {
    pendingWithdrawals: BN.from('1000000000000000000'),
    rewardDebt: BN.from('2000000000000000000'),
    amount: BN.from('30000000000000000000'),
  } as Awaited<ReturnType<ContractTypeByName<'xvsVault'>['getUserInfo']>>,
  poolInfo: {
    token: xvs.address,
    allocPoint: BN.from('10'),
    lastRewardBlock: BN.from('100000'),
    accRewardPerShare: BN.from('123871680'),
    lockPeriod: BN.from('200'),
  } as Awaited<ReturnType<ContractTypeByName<'xvsVault'>['poolInfos']>>,
  poolLength: BN.from('5'),
  totalAllocPoints: BN.from('100'),
  rewardTokenAmountsPerBlock: BN.from('10000000'),
  pendingReward: BN.from('200000000'),
  getWithdrawalRequests: [
    [BN.from('1000000000000000000'), BN.from('1656499404'), BN.from('1000000000000000000')],
    [BN.from('2000000000000000000'), BN.from('1656599404'), BN.from('1000000000000000000')],
    [BN.from('3000000000000000000'), BN.from('1656699404'), BN.from('1000000000000000000')],
  ] as Awaited<ReturnType<ContractTypeByName<'xvsVault'>['getWithdrawalRequests']>>,
};

export default xvsVaultResponses;
