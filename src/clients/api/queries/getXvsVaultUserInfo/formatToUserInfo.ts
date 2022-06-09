import BigNumber from 'bignumber.js';

import { XvsVault } from 'types/contracts';
import { IGetXvsVaultUserInfoOutput } from './types';

const formatToUserInfo = ({
  amount,
  pendingWithdrawals,
  rewardDebt,
}: Awaited<
  ReturnType<ReturnType<XvsVault['methods']['getUserInfo']>['call']>
>): IGetXvsVaultUserInfoOutput => ({
  stakedAmountWei: new BigNumber(amount),
  pendingWithdrawalsTotalAmountWei: new BigNumber(pendingWithdrawals),
  rewardDebtAmountWei: new BigNumber(rewardDebt),
});

export default formatToUserInfo;
