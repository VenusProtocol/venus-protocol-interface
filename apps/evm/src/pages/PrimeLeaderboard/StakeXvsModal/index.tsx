import { useGetVaults } from 'clients/api';
import { VenusVaultModal } from 'containers/VenusVaultModal';
import { useAccountAddress } from 'libs/wallet';
import { VaultCategory, type VenusVault } from 'types';

export interface StakeXvsModalProps {
  handleClose: () => void;
}

export const StakeXvsModal: React.FC<StakeXvsModalProps> = ({ handleClose }) => {
  const { accountAddress } = useAccountAddress();
  const { data: vaults } = useGetVaults({ accountAddress });

  const xvsVault = vaults.find(vault => vault.category === VaultCategory.GOVERNANCE) as
    | VenusVault
    | undefined;

  if (!xvsVault) {
    return null;
  }

  return (
    <VenusVaultModal isOpen vault={xvsVault} handleClose={handleClose} hidePrimeLeaderboardLink />
  );
};
