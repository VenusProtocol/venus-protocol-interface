import { VaiVault } from 'types/contracts';

const vaiVaultResponses: {
  userInfo: Awaited<ReturnType<ReturnType<VaiVault['methods']['userInfo']>['call']>>;
} = {
  userInfo: {
    amount: '100000000000000',
    rewardDebt: '2000',
    0: '100000000000000',
    1: '4000',
  },
};

export default vaiVaultResponses;
