import type { VenusVault } from 'types';
import StakeModal from './StakeModal';
import WithdrawFromVaiVaultModal from './WithdrawFromVaiVaultModal';
import WithdrawFromVestingVaultModal from './WithdrawFromVestingVaultModal';

export type ActiveModal = 'stake' | 'withdraw';

interface VaultModalsProps {
  vault: VenusVault;
  activeModal: ActiveModal | undefined;
  onClose: () => void;
}

export const VaultModals: React.FC<VaultModalsProps> = ({ vault, activeModal, onClose }) => {
  return (
    <>
      {activeModal === 'stake' && (
        <StakeModal
          stakedToken={vault.stakedToken}
          rewardToken={vault.rewardToken}
          handleClose={onClose}
          poolIndex={vault.poolIndex}
        />
      )}

      {activeModal === 'withdraw' &&
        vault.poolIndex === undefined &&
        vault.stakedToken.symbol === 'VAI' && <WithdrawFromVaiVaultModal handleClose={onClose} />}

      {activeModal === 'withdraw' && vault.poolIndex !== undefined && (
        <WithdrawFromVestingVaultModal
          handleClose={onClose}
          stakedToken={vault.stakedToken}
          poolIndex={vault.poolIndex}
          userHasPendingWithdrawalsFromBeforeUpgrade={
            vault.userHasPendingWithdrawalsFromBeforeUpgrade || false
          }
        />
      )}
    </>
  );
};
