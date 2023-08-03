import { BigNumber as BN } from 'ethers';
import { ContractTypeByName } from 'packages/contracts';

const vaiVaultResponses: {
  userInfo: Awaited<ReturnType<ContractTypeByName<'vaiVault'>['userInfo']>>;
  pendingXVS: Awaited<ReturnType<ContractTypeByName<'vaiVault'>['pendingXVS']>>;
} = {
  userInfo: {
    amount: BN.from('100000000000000000000000'),
    rewardDebt: BN.from('2000'),
  } as Awaited<ReturnType<ContractTypeByName<'vaiVault'>['userInfo']>>,
  pendingXVS: BN.from('600000000'),
};

export default vaiVaultResponses;
