import { useState } from 'react';

import type { Token } from 'types';
import { RequestWithdrawalForm } from './RequestWithdrawalForm';
import { WithdrawalRequestList } from './WithdrawalRequestList';

export interface WithdrawFromVestingVaultFormProps {
  poolIndex: number;
  stakedToken: Token;
  rewardToken: Token;
  lockingPeriodMs: number;
  onClose: () => void;
}

export const WithdrawFromVestingVaultForm: React.FC<WithdrawFromVestingVaultFormProps> = ({
  poolIndex,
  stakedToken,
  rewardToken,
  lockingPeriodMs,
  onClose,
}) => {
  const [shouldDisplayWithdrawalRequestList, setShouldDisplayWithdrawalRequestList] =
    useState(false);

  const displayWithdrawalRequestList = () => setShouldDisplayWithdrawalRequestList(true);
  const hideWithdrawalRequestList = () => setShouldDisplayWithdrawalRequestList(false);

  if (shouldDisplayWithdrawalRequestList) {
    return (
      <WithdrawalRequestList
        poolIndex={poolIndex}
        stakedToken={stakedToken}
        rewardToken={rewardToken}
        onClose={onClose}
        hideWithdrawalRequestList={hideWithdrawalRequestList}
      />
    );
  }

  return (
    <RequestWithdrawalForm
      poolIndex={poolIndex}
      stakedToken={stakedToken}
      rewardToken={rewardToken}
      lockingPeriodMs={lockingPeriodMs}
      displayWithdrawalRequestList={displayWithdrawalRequestList}
    />
  );
};
