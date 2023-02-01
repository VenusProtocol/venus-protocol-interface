import { BigNumber as BN } from 'ethers';

import { VaiVault } from 'types/contracts';

const vaiVaultResponses: {
  userInfo: Awaited<ReturnType<VaiVault['userInfo']>>;
  pendingXVS: Awaited<ReturnType<VaiVault['pendingXVS']>>;
} = {
  userInfo: {
    amount: BN.from('100000000000000000000000'),
    rewardDebt: BN.from('2000'),
  } as Awaited<ReturnType<VaiVault['userInfo']>>,
  pendingXVS: BN.from('600000000'),
};

export default vaiVaultResponses;
