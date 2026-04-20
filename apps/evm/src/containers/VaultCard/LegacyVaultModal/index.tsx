import { Modal, Tabs } from 'components';
import { useTranslation } from 'libs/translations';
import type { VenusVault } from 'types';
import { VaultName } from '../VaultName';
import { StakeForm } from './StakeForm';
import { WithdrawTab } from './WithdrawTab';

export interface LegacyVaultModalProps {
  vault: VenusVault;
  handleClose: () => void;
  initialMode?: 'deposit' | 'withdraw';
  isOpen: boolean;
}

export const LegacyVaultModal: React.FC<LegacyVaultModalProps> = ({
  vault,
  handleClose,
  isOpen,
}) => {
  const { t } = useTranslation();

  const tabs = [
    {
      id: 'stake',
      title: t('vault.modals.stakeTab'),
      content: <StakeForm vault={vault} onClose={handleClose} />,
    },
    {
      id: 'withdraw',
      title: t('vault.modals.withdrawTab'),
      content: <WithdrawTab vault={vault} onClose={handleClose} />,
    },
  ];

  return (
    <Modal
      isOpen={isOpen}
      handleClose={handleClose}
      title={<VaultName vault={vault} />}
      useDrawerInXs
    >
      <Tabs tabs={tabs} />
    </Modal>
  );
};
