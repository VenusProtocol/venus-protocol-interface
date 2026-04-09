import { Spinner } from '@venusprotocol/ui';
import { isToday, isYesterday } from 'date-fns';
import { useMemo } from 'react';

import type { GetAccountTransactionHistoryOutput } from 'clients/api';
import { useTranslation } from 'libs/translations';
import { Card } from '../Card';
import { Icon } from '../Icon';
import { TransactionRow } from './TransactionRow';

export interface TransactionsListProps {
  transactions: GetAccountTransactionHistoryOutput['transactions'];
  isLoading?: boolean;
}

export const TransactionsList: React.FC<TransactionsListProps> = ({
  transactions,
  isLoading = false,
}) => {
  const { t } = useTranslation();

  const transactionsGroupedByDate = useMemo(
    () =>
      transactions.reduce<Record<string, GetAccountTransactionHistoryOutput['transactions']>>(
        (acc, txData) => {
          const isTodayGroup = isToday(txData.blockTimestamp);
          const isYesterdayGroup = isYesterday(txData.blockTimestamp);

          let dayGroup = t('account.transactions.date.full', {
            date: new Date(txData.blockTimestamp),
          });

          if (isTodayGroup) {
            dayGroup = t('account.transactions.today');
          } else if (isYesterdayGroup) {
            dayGroup = t('account.transactions.yesterday');
          }

          if (!acc[dayGroup]) {
            acc[dayGroup] = [];
          }

          acc[dayGroup].push(txData);

          return acc;
        },
        {},
      ),
    [transactions, t],
  );

  if (isLoading) {
    return <Spinner />;
  }

  if (transactions.length === 0) {
    return (
      <Card className="flex items-center justify-center h-72">
        <div className="text-center">
          <div className="w-10 h-10 rounded-lg bg-lightGrey flex items-center justify-center mb-4 mx-auto">
            <Icon name="transactionFile" className="w-6 h-6 text-grey" />
          </div>

          <h2 className="mb-1 font-semibold">{t('account.transactions.placeholder.title')}</h2>

          <p className="text-grey text-sm">{t('account.transactions.placeholder.description')}</p>
        </div>
      </Card>
    );
  }

  return (
    <div className="w-full @container/transactionList">
      <ul className="flex flex-col items-center justify-evenly space-y-6 @2xl:border @2xl:border-dark-blue-hover @2xl:py-4 @2xl:rounded-xl @2xl:space-y-4 lg:py-6">
        {Object.entries(transactionsGroupedByDate).map(([day, dayTransactions]) => (
          <li key={day} className="flex flex-col w-full space-y-3 @2xl:space-y-0">
            <span className="text-base font-semibold @2xl:px-6 @2xl:mb-2">{day}</span>

            {dayTransactions.map((transaction, index) => (
              <TransactionRow
                key={`${transaction.hash}-${transaction.blockNumber}-${index}`}
                transaction={transaction}
              />
            ))}
          </li>
        ))}
      </ul>
    </div>
  );
};
