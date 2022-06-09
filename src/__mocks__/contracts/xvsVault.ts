import { XvsVault } from 'types/contracts';

const xvsVaultResponses: {
  userInfos: Awaited<ReturnType<ReturnType<XvsVault['methods']['getUserInfo']>['call']>>;
} = {
  userInfos: {
    pendingWithdrawals: '1000000000000000000',
    rewardDebt: '2000000000000000000',
    amount: '3000000000000000000',
    0: '1000000000000000000',
    1: '2000000000000000000',
    2: '3000000000000000000',
  },
};

export default xvsVaultResponses;
