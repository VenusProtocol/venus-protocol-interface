import BigNumber from 'bignumber.js';
import { XvsVault } from 'packages/contracts';

import { GetXvsVaultUserInfoOutput } from './types';

const formatToUserInfo = ({
  amount,
  pendingWithdrawals,
  rewardDebt,
}: Awaited<ReturnType<XvsVault['getUserInfo']>>): GetXvsVaultUserInfoOutput => ({
  stakedAmountWei: new BigNumber(amount.toString()),
  pendingWithdrawalsTotalAmountWei: new BigNumber(pendingWithdrawals.toString()),
  rewardDebtAmountWei: new BigNumber(rewardDebt.toString()),
});

export default formatToUserInfo;
