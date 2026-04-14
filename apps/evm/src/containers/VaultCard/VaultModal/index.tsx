import { Modal, Tabs } from 'components';
import { useTranslation } from 'libs/translations';
import type { InstitutionalVault, PendleVault } from 'types';

import { TokenIconWithPeriod } from '../TokenIconWithPeriod';
import { OverviewTab } from './OverviewTab';
import { PositionTab } from './PositionTab';

export interface VaultModalProps {
  vault: PendleVault | InstitutionalVault;
  handleClose: () => void;
  initialMode?: 'deposit' | 'withdraw';
  isOpen: boolean;
}

export const VaultModal: React.FC<VaultModalProps> = ({
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
      title={
        <TokenIconWithPeriod token={vault.stakedToken} targetDate={vault.maturityDate} size="xl" />
      }
      useDrawerInXs
    >
      <Tabs tabs={tabs} variant="secondary" buttonClassName="flex-1" />
    </Modal>
  );
};
