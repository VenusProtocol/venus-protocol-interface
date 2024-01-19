import BigNumber from 'bignumber.js';

import { XvsVault } from 'packages/contracts';

import { GetXvsVaultUserInfoOutput } from './types';

const formatToUserInfo = ({
  amount,
  pendingWithdrawals,
  rewardDebt,
}: Awaited<ReturnType<XvsVault['getUserInfo']>>): GetXvsVaultUserInfoOutput => ({
  stakedAmountMantissa: new BigNumber(amount.toString()),
  pendingWithdrawalsTotalAmountMantissa: new BigNumber(pendingWithdrawals.toString()),
  rewardDebtAmountMantissa: new BigNumber(rewardDebt.toString()),
});

export default formatToUserInfo;
