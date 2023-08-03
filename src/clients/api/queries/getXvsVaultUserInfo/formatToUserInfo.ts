import BigNumber from 'bignumber.js';
import { ContractTypeByName } from 'packages/contracts';

import { GetXvsVaultUserInfoOutput } from './types';

const formatToUserInfo = ({
  amount,
  pendingWithdrawals,
  rewardDebt,
}: Awaited<
  ReturnType<ContractTypeByName<'xvsVault'>['getUserInfo']>
>): GetXvsVaultUserInfoOutput => ({
  stakedAmountWei: new BigNumber(amount.toString()),
  pendingWithdrawalsTotalAmountWei: new BigNumber(pendingWithdrawals.toString()),
  rewardDebtAmountWei: new BigNumber(rewardDebt.toString()),
});

export default formatToUserInfo;
