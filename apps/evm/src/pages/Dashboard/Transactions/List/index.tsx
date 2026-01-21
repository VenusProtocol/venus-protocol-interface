import { cn } from '@venusprotocol/ui';
import type { AmountTransaction, GetAccountTransactionHistoryOutput } from 'clients/api';
import { Pagination } from 'components';
import { format, isToday, isYesterday } from 'date-fns';
import { useTranslation } from 'libs/translations';
import { useMemo } from 'react';
import { Row } from './Row';

const INITIAL_PAGE_INDEX = 1;
const ITEMS_PER_PAGE_COUNT = 20;

export interface ListProps {
  transactions: GetAccountTransactionHistoryOutput['transactions'];
  transactionsCount: number;
  onPageChange: (newPage: number) => void;
  className?: string;
}

export const List: React.FC<ListProps> = ({
  transactions,
  transactionsCount,
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
          dayGroup = t('dashboard.transactions.today');
        }

        if (isYesterdayGroup) {
          dayGroup = t('dashboard.transactions.yesterday');
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

  return (
    <>
      <ul
        className={cn(
          'flex flex-col w-full items-center justify-evenly space-y-6 md:rounded-xl md:space-y-4',
          className,
        )}
      >
        {Object.keys(transactionsGroupedByDate).map(day => (
          <li className="flex flex-col w-full space-y-3">
            <p className="font-semibold">{day}</p>

            <div className="space-y-6 md:space-y-0">
              {transactionsGroupedByDate[day].map(amountTransaction => (
                <Row amountTransaction={amountTransaction} />
              ))}
            </div>
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
