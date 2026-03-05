import { cn } from '@venusprotocol/ui';
import { Icon } from 'components/Icon';
import { Tabs } from 'components/Tabs';
import { useTranslation } from 'libs/translations';

export interface PositionsTableProps {
  isWalletConnected: boolean;
  className?: string;
}

const WalletDisconnectedEmptyState: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col items-center justify-center py-12 gap-3">
      <div className="flex items-center justify-center size-14 rounded-full bg-cards border border-lightGrey">
        <Icon name="wallet" className="size-7 text-grey" />
      </div>
      <p className="text-b1s text-white">
        {t('yieldPlus.positionsTable.emptyState.walletDisconnected.title')}
      </p>
      <p className="text-b1r text-grey">
        {t('yieldPlus.positionsTable.emptyState.walletDisconnected.description')}
      </p>
    </div>
  );
};

const ConnectedEmptyState: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col items-center justify-center py-12">
      <p className="text-b1r text-grey">
        {t('yieldPlus.positionsTable.emptyState.walletDisconnected.description')}
      </p>
    </div>
  );
};

export const PositionsTable: React.FC<PositionsTableProps> = ({ isWalletConnected, className }) => {
  const { t } = useTranslation();

  const emptyContent = isWalletConnected ? (
    <ConnectedEmptyState />
  ) : (
    <WalletDisconnectedEmptyState />
  );

  const tabs = [
    {
      id: 'positions',
      title: t('yieldPlus.positionsTable.tabs.positions'),
      content: emptyContent,
    },
    {
      id: 'transactions',
      title: t('yieldPlus.positionsTable.tabs.transactions'),
      content: emptyContent,
    },
  ];

  return (
    <div className={cn('rounded-xl bg-cards border border-lightGrey px-4 pt-2 pb-2', className)}>
      <Tabs tabs={tabs} variant="secondary" />
    </div>
  );
};
