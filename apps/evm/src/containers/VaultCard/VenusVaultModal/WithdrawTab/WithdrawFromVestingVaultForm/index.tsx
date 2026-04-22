import { useState } from 'react';

import type { VenusVault } from 'types';
import { RequestWithdrawalForm } from './RequestWithdrawalForm';
import { WithdrawalRequestList } from './WithdrawalRequestList';

export interface WithdrawFromVestingVaultFormProps {
  vault: VenusVault;
  onClose: () => void;
}

export const WithdrawFromVestingVaultForm: React.FC<WithdrawFromVestingVaultFormProps> = ({
  vault,
  onClose,
}) => {
  const [shouldDisplayWithdrawalRequestList, setShouldDisplayWithdrawalRequestList] =
    useState(false);

  const displayWithdrawalRequestList = () => setShouldDisplayWithdrawalRequestList(true);
  const hideWithdrawalRequestList = () => setShouldDisplayWithdrawalRequestList(false);

  if (shouldDisplayWithdrawalRequestList) {
    return (
      <WithdrawalRequestList
        vault={vault}
        onClose={onClose}
        hideWithdrawalRequestList={hideWithdrawalRequestList}
      />
    );
  }

  return (
    <RequestWithdrawalForm
      vault={vault}
      displayWithdrawalRequestList={displayWithdrawalRequestList}
    />
  );
};
