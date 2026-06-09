import { useAccountAddress } from 'libs/wallet';
import { type InstitutionalVault, VaultStatus } from 'types';
import { DepositForm } from './DepositForm';
import { StatusContent } from './StatusContent';

export interface PositionTabProps {
  vault: InstitutionalVault;
  onClose: () => void;
}

export const PositionTab: React.FC<PositionTabProps> = ({ vault, onClose }) => {
  const { accountAddress } = useAccountAddress();

  const shouldRenderStatusContent =
    accountAddress &&
    (vault.status === VaultStatus.Claim ||
      vault.status === VaultStatus.Refund ||
      vault.status === VaultStatus.Locked ||
      vault.status === VaultStatus.Pending ||
      vault.status === VaultStatus.Repaying ||
      vault.status === VaultStatus.Paused ||
      vault.status === VaultStatus.Inactive ||
      vault.status === VaultStatus.Liquidated);

  if (shouldRenderStatusContent) {
    return <StatusContent vault={vault} onClose={onClose} />;
  }

  return <DepositForm vault={vault} onClose={onClose} />;
};
