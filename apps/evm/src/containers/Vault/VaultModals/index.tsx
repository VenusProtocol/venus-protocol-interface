import type { Vault } from 'types';
import StakeModal from './StakeModal';
import WithdrawFromVaiVaultModal from './WithdrawFromVaiVaultModal';
import WithdrawFromVestingVaultModal from './WithdrawFromVestingVaultModal';

export type ActiveModal = 'stake' | 'withdraw';

interface VaultModalsProps {
  vault: Vault;
  activeModal: ActiveModal | undefined;
  onClose: () => void;
}

export const VaultModals: React.FC<VaultModalsProps> = ({ vault, activeModal, onClose }) => {
  const modals = (
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

  return modals;
};
