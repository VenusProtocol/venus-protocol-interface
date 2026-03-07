import { AccordionAnimatedContent, Card, Tabs } from 'components';
// import { useIsFeatureEnabled } from 'hooks/useIsFeatureEnabled';
import type { Tab } from 'hooks/useTabs';
import { useTranslation } from 'libs/translations';
import type { YieldPlusPosition } from 'types';
import { StatusTab } from './StatusTab';
import { TransactionsTab } from './TransactionsTab';

export interface RowFooterProps {
  row: YieldPlusPosition;
  isOpen: boolean;
}

export const RowFooter: React.FC<RowFooterProps> = ({ row, isOpen }) => {
  const { t } = useTranslation();

  // const isTransactionHistoryFeatureEnabled = useIsFeatureEnabled({
  //   name: 'transactionHistory',
  // });

  // DEV ONLY
  const isTransactionHistoryFeatureEnabled = true;
  // END DEV ONLY

  const tabs: Tab[] = [
    {
      title: t('yieldPlus.positions.status.title'),
      id: 'status',
      content: <StatusTab row={row} />,
    },
    {
      title: t('yieldPlus.positions.transactions.title'),
      id: 'transactions',
      content: <TransactionsTab row={row} />,
    },
  ];

  return (
    <AccordionAnimatedContent className="flex flex-col gap-y-6 md:mb-4" isOpen={isOpen}>
      <Card className="flex flex-col gap-y-6 bg-dark-blue border-background-hover p-3 md:p-6">
        {isTransactionHistoryFeatureEnabled ? (
          <Tabs tabs={tabs} variant="secondary" />
        ) : (
          <StatusTab row={row} />
        )}
      </Card>
    </AccordionAnimatedContent>
  );
};
