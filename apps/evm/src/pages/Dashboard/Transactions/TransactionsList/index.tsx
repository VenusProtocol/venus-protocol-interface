import { Spinner, cn } from '@venusprotocol/ui';
import { format, isToday, isYesterday } from 'date-fns';
import { useMemo } from 'react';

import type { AmountTransaction, GetAccountTransactionHistoryOutput } from 'clients/api';
import { Pagination } from 'components';
import { useTranslation } from 'libs/translations';
import { Placeholder } from '../../Placeholder';
import { TransactionRow } from '../TransactionRow';

const INITIAL_PAGE_INDEX = 1;
const ITEMS_PER_PAGE_COUNT = 20;

export interface TransactionsListProps {
  transactions: GetAccountTransactionHistoryOutput['transactions'];
  transactionsCount: number;
  onPageChange: (newPage: number) => void;
  isLoading: boolean;
  className?: string;
}

export const TransactionsList: React.FC<TransactionsListProps> = ({
  transactions,
  transactionsCount,
  isLoading,
  onPageChange,
  className,
}) => {
  const { t } = useTranslation();

  const transactionsGroupedByDate = useMemo(() => {
    const groupedByDate = transactions.reduce<Record<string, AmountTransaction[]>>(
      (acc, txData) => {
        const isTodayGroup = isToday(txData.blockTimestamp);
        const isYesterdayGroup = isYesterday(txData.blockTimestamp);

        let dayGroup = format(txData.blockTimestamp, 'MMM dd, yyyy');

        if (isTodayGroup) {
          dayGroup = t('account.transactions.today');
        }

        if (isYesterdayGroup) {
          dayGroup = t('account.transactions.yesterday');
        }

        const dayTxs = acc[dayGroup] ? [...acc[dayGroup], txData] : [txData];

        return {
          ...acc,
          [dayGroup]: dayTxs,
        };
      },
      {},
    );

    return groupedByDate;
  }, [transactions, t]);

  if (isLoading) {
    return <Spinner />;
  }

  if (transactions.length === 0) {
    return (
      <Placeholder
        iconName="transactionFile"
        title={t('account.transactions.placeholder.title')}
        description={t('account.transactions.placeholder.description')}
      />
    );
  }

  return (
    <>
      <ul
        className={cn(
          'flex flex-col w-full items-center justify-evenly space-y-6 md:bg-cards md:py-4 md:rounded-xl md:space-y-4 lg:py-6',
          className,
        )}
      >
        {Object.keys(transactionsGroupedByDate).map(day => (
          <li className="flex flex-col w-full space-y-3 md:space-y-0">
            <span className="text-base font-semibold md:px-6 md:mb-2">{day}</span>
            {transactionsGroupedByDate[day].map(transactionData => (
              <TransactionRow transactionData={transactionData} />
            ))}
          </li>
        ))}
      </ul>
      <Pagination
        initialPageIndex={INITIAL_PAGE_INDEX}
        itemsCount={transactionsCount}
        itemsPerPageCount={ITEMS_PER_PAGE_COUNT}
        onChange={onPageChange}
      />
    </>
  );
};
