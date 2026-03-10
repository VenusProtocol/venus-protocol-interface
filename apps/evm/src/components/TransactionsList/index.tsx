import { Spinner } from '@venusprotocol/ui';
import { isToday, isYesterday } from 'date-fns';
import { useMemo } from 'react';

import type { AmountTransaction, GetAccountTransactionHistoryOutput } from 'clients/api';
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
      transactions.reduce<Record<string, AmountTransaction[]>>((acc, txData) => {
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
      }, {}),
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
    <ul className="flex flex-col w-full items-center justify-evenly space-y-6 md:border md:border-dark-blue-hover md:py-4 md:rounded-xl md:space-y-4 lg:py-6">
      {Object.entries(transactionsGroupedByDate).map(([day, dayTransactions]) => (
        <li key={day} className="flex flex-col w-full space-y-3 md:space-y-0">
          <span className="text-base font-semibold md:px-6 md:mb-2">{day}</span>

          {dayTransactions.map((transactionData, index) => (
            <TransactionRow
              key={`${transactionData.hash}-${transactionData.blockNumber}-${index}`}
              transactionData={transactionData}
            />
          ))}
        </li>
      ))}
    </ul>
  );
};
