import { Modal, Tabs } from 'components';
import { VaultName } from 'containers/VaultCard/VaultName';
import { useTranslation } from 'libs/translations';
import type { VenusVault } from 'types';
import { StakeForm } from './StakeForm';
import { WithdrawTab } from './WithdrawTab';

export interface VenusVaultModalProps {
  vault: VenusVault;
  handleClose: () => void;
  initialMode?: 'deposit' | 'withdraw';
  isOpen: boolean;
  hidePrimeLeaderboardLink?: boolean;
}

export const VenusVaultModal: React.FC<VenusVaultModalProps> = ({
  vault,
  handleClose,
  isOpen,
  hidePrimeLeaderboardLink,
}) => {
  const { t } = useTranslation();

  const tabs = [
    {
      id: 'stake',
      title: t('vault.modals.stakeTab'),
      content: (
        <StakeForm
          vault={vault}
          onClose={handleClose}
          hidePrimeLeaderboardLink={hidePrimeLeaderboardLink}
        />
      ),
    },
    {
      id: 'withdraw',
      title: t('vault.modals.withdrawTab'),
      content: <WithdrawTab vault={vault} onClose={handleClose} />,
    },
  ];

  return (
    <Modal isOpen={isOpen} handleClose={handleClose} title={<VaultName vault={vault} />}>
      <Tabs tabs={tabs} />
    </Modal>
  );
};
