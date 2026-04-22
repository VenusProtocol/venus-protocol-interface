import { Modal, Tabs } from 'components';
import { useTranslation } from 'libs/translations';
import type { PendleVault } from 'types';

import { VaultName } from '../VaultName';
import { OverviewTab } from './OverviewTab';
import { PositionTab } from './PositionTab';

export interface PendleVaultModalProps {
  vault: PendleVault;
  handleClose: () => void;
  isOpen: boolean;
}

export const PendleVaultModal: React.FC<PendleVaultModalProps> = ({
  vault,
  handleClose,
  isOpen,
}) => {
  const { t } = useTranslation();

  const tabs = [
    {
      id: 'position',
      title: t('vault.modals.positionTab'),
      content: <PositionTab vault={vault} onClose={handleClose} />,
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
