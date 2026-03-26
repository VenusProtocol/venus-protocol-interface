import { Modal, Tabs, cn } from 'components';
import { useTranslation } from 'libs/translations';
import type { AnyVault } from 'types';

import { TokenIconWithPeriod } from '../VaultCard/TokenIconWithPeriod';
import { OverviewTab } from './OverviewTab';
import { PositionTab } from './PositionTab';

export interface PendleModalProps {
  vault: AnyVault;
  handleClose: () => void;
  initialMode?: 'deposit' | 'withdraw';
  isOpen: boolean;
}

export const PendleModal: React.FC<PendleModalProps> = ({
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
        <TokenIconWithPeriod
          token={vault.stakedToken}
          targetTime={'maturityTimestampMs' in vault ? vault.maturityTimestampMs : undefined}
          size="xl"
        />
      }
      className={cn('max-sm:w-full max-sm:translate-y-[calc(-50%+1rem)] max-sm:rounded-b-none')}
    >
      <Tabs tabs={tabs} variant="secondary" buttonClassName="flex-1" />
    </Modal>
  );
};

export default PendleModal;
