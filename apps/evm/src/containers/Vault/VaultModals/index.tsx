import { Modal, Tabs, TokenIcon, cn } from 'components';
import { useTranslation } from 'libs/translations';
import type { AnyVault } from 'types';

import { PLACEHOLDER_KEY } from 'constants/placeholders';
import { useNow } from 'hooks/useNow';
import { formatDateToUtc } from 'utilities';
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
  const now = useNow();

  const maturityDateUtc =
    'maturityDate' in vault
      ? formatDateToUtc(vault.maturityDate, { formatStr: 'MMM dd yyyy HH:mm' })
      : undefined;
  const formattedMaturityDate = maturityDateUtc ? `${maturityDateUtc} UTC` : PLACEHOLDER_KEY;

  const daysRemaining =
    'maturityDate' in vault && vault.maturityDate
      ? Math.ceil((new Date(vault.maturityDate).getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
      : undefined;

  const title = (
    <div className="flex items-center gap-2 min-w-0">
      <TokenIcon token={vault.stakedToken} size="md" className="shrink-0" />
      <div className="flex flex-col min-w-0">
        <span className="text-b1s truncate">{vault.stakedToken.symbol}</span>
        {formattedMaturityDate && daysRemaining !== undefined && daysRemaining > 0 && (
          <span className="text-b2r text-grey">
            {formattedMaturityDate} ({t('vault.modals.daysRemaining', { days: daysRemaining })})
          </span>
        )}
      </div>
    </div>
  );

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
      title={title}
      className={cn('max-sm:w-full max-sm:translate-y-[calc(-50%+1rem)] max-sm:rounded-b-none')}
    >
      <Tabs tabs={tabs} variant="secondary" buttonClassName="flex-1" />
    </Modal>
  );
};

export default PendleModal;
