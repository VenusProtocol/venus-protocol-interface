import { Tabs } from 'components';
import { useNow } from 'hooks/useNow';
import { useTranslation } from 'libs/translations';
import type { PendleVault } from 'types';

import { DepositForm } from './DepositForm';
import { WithdrawForm } from './WithdrawForm';

export interface PositionTabProps {
  vault: PendleVault;
  onClose: () => void;
}

export const PositionTab: React.FC<PositionTabProps> = ({ vault, onClose }) => {
  const { t } = useTranslation();
  const now = useNow();
  const hasMatured = !!vault.maturityDate && now.getTime() > vault.maturityDate.getTime();

  if (hasMatured) {
    return <WithdrawForm vault={vault} onClose={onClose} />;
  }

  const tabs = [
    {
      id: 'deposit',
      title: t('vault.modals.depositTab'),
      content: <DepositForm vault={vault} onClose={onClose} />,
    },
    {
      id: 'withdraw',
      title: t('vault.modals.withdrawTab'),
      content: <WithdrawForm vault={vault} onClose={onClose} />,
    },
  ];

  return <Tabs tabs={tabs} />;
};
