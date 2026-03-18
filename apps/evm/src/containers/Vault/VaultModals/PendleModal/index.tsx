import { format } from 'date-fns';

import { Modal, Tabs, TokenIcon } from 'components';
import { useTranslation } from 'libs/translations';
import type { AnyVault } from 'types';

import { OverviewTab } from './OverviewTab';
import { PositionTab } from './PositionTab';

export interface PendleModalProps {
  vault: AnyVault;
  handleClose: () => void;
  initialMode?: 'stake' | 'withdraw';
  isOpen: boolean;
}

export const PendleModal: React.FC<PendleModalProps> = ({
  vault,
  handleClose,
  initialMode = 'stake',
  isOpen,
}) => {
  const { t } = useTranslation();

  const maturityDate = vault.lockingPeriodMs
    ? new Date(Date.now() + vault.lockingPeriodMs)
    : undefined;

  const formattedMaturityDate = maturityDate ? format(maturityDate, 'dd MMM yyyy') : undefined;

  const daysRemaining = maturityDate
    ? Math.ceil((maturityDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24))
    : undefined;

  const title = (
    <div className="flex items-center gap-2 min-w-0">
      <TokenIcon token={vault.stakedToken} size="md" className="shrink-0" />
      <div className="flex flex-col min-w-0">
        <span className="text-b1s truncate">{vault.stakedToken.symbol}</span>
        {formattedMaturityDate && daysRemaining !== undefined && daysRemaining > 0 && (
          <span className="text-b2r text-grey">
            {formattedMaturityDate} ({t('pendleModal.daysRemaining', { days: daysRemaining })})
          </span>
        )}
      </div>
    </div>
  );

  const tabs = [
    {
      id: 'position',
      title: t('pendleModal.positionTab'),
      content: <PositionTab vault={vault} initialMode={initialMode} onClose={handleClose} />,
    },
    {
      id: 'overview',
      title: t('pendleModal.overviewTab'),
      content: <OverviewTab vault={vault} />,
    },
  ];

  return (
    <Modal isOpen={isOpen} handleClose={handleClose} title={title}>
      <Tabs tabs={tabs} variant="secondary" buttonClassName="flex-1" />
    </Modal>
  );
};

export default PendleModal;
