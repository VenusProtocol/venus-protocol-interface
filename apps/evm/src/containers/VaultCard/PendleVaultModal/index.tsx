import { Modal, Tabs } from 'components';
import { useTranslation } from 'libs/translations';
import type { PendleVault } from 'types';

import { VaultName } from '../VaultName';
import { OverviewTab } from './OverviewTab';
import { PositionTab } from './PositionTab';

export interface PendleVaultModalProps {
  vault: PendleVault;
  handleClose: () => void;
  initialMode?: 'deposit' | 'withdraw';
  isOpen: boolean;
}

export const PendleVaultModal: React.FC<PendleVaultModalProps> = ({
  vault,
  handleClose,
  initialMode = 'deposit',
  isOpen,
}) => {
  const { t } = useTranslation();

  const tabs = [
    {
      id: 'position',
      title: t('vault.modals.positionTab'),
      content: <PositionTab vault={vault} onClose={handleClose} initialMode={initialMode} />,
    },
    {
      id: 'overview',
      title: t('vault.modals.overviewTab'),
      content: <OverviewTab vault={vault} />,
    },
  ];

  return (
    <Modal
      isOpen={isOpen}
      handleClose={handleClose}
      title={<VaultName vault={vault} />}
      useDrawerInXs
    >
      <Tabs tabs={tabs} variant="secondary" buttonClassName="flex-1" />
    </Modal>
  );
};
