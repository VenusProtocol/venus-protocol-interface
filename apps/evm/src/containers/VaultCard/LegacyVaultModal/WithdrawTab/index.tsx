import { Spinner } from '@venusprotocol/ui';
import type { VenusVault } from 'types';
import { WithdrawFromVaiVaultForm } from './WithdrawFromVaiVaultForm';
import { WithdrawFromVestingVaultForm } from './WithdrawFromVestingVaultForm';

export interface WithdrawTabProps {
  vault: VenusVault;
  onClose: () => void;
}

export const WithdrawTab: React.FC<WithdrawTabProps> = ({ vault, onClose }) => {
  if (vault.poolIndex === undefined && vault.stakedToken.symbol === 'VAI') {
    return <WithdrawFromVaiVaultForm onClose={onClose} />;
  }

  if (vault.poolIndex !== undefined && vault.lockingPeriodMs !== undefined) {
    return (
      <WithdrawFromVestingVaultForm
        poolIndex={vault.poolIndex}
        stakedToken={vault.stakedToken}
        rewardToken={vault.rewardToken}
        lockingPeriodMs={vault.lockingPeriodMs}
        onClose={onClose}
      />
    );
  }

  // This is only a safeguard, this case does not exist
  return <Spinner />;
};
