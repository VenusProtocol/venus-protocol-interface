import { cn } from '@venusprotocol/ui';
import type { YieldPlusTransaction } from 'clients/api/queries/yieldPlus/types';
import { Icon } from 'components';
import { useTranslation } from 'libs/translations';

export interface TransactionsTableProps {
  transactions: YieldPlusTransaction[];
  isLoading?: boolean;
  accountAddress?: string;
  className?: string;
}

const formatTimestamp = (timestamp: number) => {
  const date = new Date(timestamp * 1000);
  return date.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

export const TransactionsTable: React.FC<TransactionsTableProps> = ({
  transactions,
  isLoading,
  accountAddress,
  className,
}) => {
  const { t } = useTranslation();

  const hasTransactions = transactions.length > 0;

  if (isLoading) {
    return (
      <div className={cn('flex items-center justify-center py-16', className)}>
        <div className="animate-spin size-8 border-2 border-blue border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!hasTransactions) {
    return (
      <div
        className={cn(
          'flex flex-col items-center justify-center gap-y-3 py-16 border border-dark-blue rounded-xl',
          className,
        )}
      >
        <div className="flex items-center justify-center size-14 rounded-xl bg-dark-blue">
          <Icon name="wallet" className="size-7 text-grey" />
        </div>

        <div className="flex flex-col items-center gap-y-1">
          <p className="text-b1s text-white">
            {accountAddress
              ? t('yieldPlus.emptyState.noOpenPosition')
              : t('yieldPlus.emptyState.walletDisconnected')}
          </p>
          {!accountAddress && (
            <p className="text-b2r text-grey">{t('yieldPlus.emptyState.noOpenPosition')}</p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className={cn('overflow-x-auto', className)}>
      <table className="w-full min-w-[600px]">
        <thead>
          <tr className="border-b border-dark-blue">
            <th className="text-b2r text-grey text-left py-3 px-4 font-normal whitespace-nowrap">
              Type
            </th>
            <th className="text-b2r text-grey text-left py-3 px-4 font-normal whitespace-nowrap">
              Pair
            </th>
            <th className="text-b2r text-grey text-left py-3 px-4 font-normal whitespace-nowrap">
              Side
            </th>
            <th className="text-b2r text-grey text-right py-3 px-4 font-normal whitespace-nowrap">
              Collateral
            </th>
            <th className="text-b2r text-grey text-right py-3 px-4 font-normal whitespace-nowrap">
              Price
            </th>
            <th className="text-b2r text-grey text-right py-3 px-4 font-normal whitespace-nowrap">
              Time
            </th>
          </tr>
        </thead>

        <tbody>
          {transactions.map(tx => (
            <tr key={tx.id} className="border-b border-dark-blue hover:bg-dark-blue">
              <td className="py-4 px-4">
                <span
                  className={cn(
                    'inline-flex items-center rounded-lg px-2 py-0.5 text-b2s capitalize',
                    tx.type === 'open' && 'bg-green/20 text-green',
                    tx.type === 'close' && 'bg-grey/20 text-grey',
                    tx.type === 'liquidation' && 'bg-red/20 text-red',
                  )}
                >
                  {tx.type}
                </span>
              </td>

              <td className="py-4 px-4">
                <span className="text-b1s text-white">
                  {tx.longToken.symbol}/{tx.shortToken.symbol}
                </span>
              </td>

              <td className="py-4 px-4">
                <span
                  className={cn(
                    'inline-flex items-center rounded-lg px-2 py-0.5 text-b2s',
                    tx.side === 'long' ? 'bg-green text-background' : 'bg-red text-background',
                  )}
                >
                  {tx.side === 'long' ? t('yieldPlus.long') : t('yieldPlus.short')}
                </span>
              </td>

              <td className="py-4 px-4 text-right">
                <span className="text-b1r text-white">{tx.collateralAmount}</span>
              </td>

              <td className="py-4 px-4 text-right">
                <span className="text-b1r text-white">${tx.price}</span>
              </td>

              <td className="py-4 px-4 text-right">
                <span className="text-b2r text-grey">{formatTimestamp(tx.timestamp)}</span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
