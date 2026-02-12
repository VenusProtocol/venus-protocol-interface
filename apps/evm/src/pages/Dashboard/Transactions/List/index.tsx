import { cn } from '@venusprotocol/ui';
import type { AmountTransaction, GetAccountTransactionHistoryOutput } from 'clients/api';
import { format, isToday, isYesterday } from 'date-fns';
import { useTranslation } from 'libs/translations';
import { Row } from './Row';

export interface ListProps {
  transactions: GetAccountTransactionHistoryOutput['transactions'];
  className?: string;
}

export const List: React.FC<ListProps> = ({ transactions, className }) => {
  const { t } = useTranslation();

  const transactionsGroupedByDate = transactions.reduce<Record<string, AmountTransaction[]>>(
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

  return (
    <ul
      className={cn(
        'flex flex-col w-full items-center justify-evenly space-y-6 sm:space-y-4',
        className,
      )}
    >
      {Object.keys(transactionsGroupedByDate).map(day => (
        <li className="flex flex-col w-full space-y-3">
          <p className="font-semibold">{day}</p>

          <div className="space-y-6 sm:space-y-0">
            {transactionsGroupedByDate[day].map(amountTransaction => (
              <Row amountTransaction={amountTransaction} />
            ))}
          </div>
        </li>
      ))}
    </ul>
  );
};
