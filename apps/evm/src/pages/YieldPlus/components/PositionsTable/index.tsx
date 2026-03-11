import { cn } from '@venusprotocol/ui';
import type { YieldPlusPosition } from 'clients/api/queries/yieldPlus/types';
import { Icon } from 'components';
import { useTranslation } from 'libs/translations';

export interface PositionsTableProps {
  positions: YieldPlusPosition[];
  isLoading?: boolean;
  accountAddress?: string;
  className?: string;
}

export const PositionsTable: React.FC<PositionsTableProps> = ({
  positions,
  isLoading,
  accountAddress,
  className,
}) => {
  const { t } = useTranslation();

  const hasPositions = positions.length > 0;

  if (isLoading) {
    return (
      <div className={cn('flex items-center justify-center py-16', className)}>
        <div className="animate-spin size-8 border-2 border-blue border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!hasPositions) {
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
              Pair
            </th>
            <th className="text-b2r text-grey text-left py-3 px-4 font-normal whitespace-nowrap">
              Side
            </th>
            <th className="text-b2r text-grey text-right py-3 px-4 font-normal whitespace-nowrap">
              Collateral
            </th>
            <th className="text-b2r text-grey text-right py-3 px-4 font-normal whitespace-nowrap">
              Leverage
            </th>
            <th className="text-b2r text-grey text-right py-3 px-4 font-normal whitespace-nowrap">
              Entry price
            </th>
            <th className="text-b2r text-grey text-right py-3 px-4 font-normal whitespace-nowrap">
              PnL
            </th>
          </tr>
        </thead>

        <tbody>
          {positions.map(position => (
            <tr key={position.id} className="border-b border-dark-blue hover:bg-dark-blue">
              <td className="py-4 px-4">
                <span className="text-b1s text-white">
                  {position.longToken.symbol}/{position.shortToken.symbol}
                </span>
              </td>

              <td className="py-4 px-4">
                <span
                  className={cn(
                    'inline-flex items-center rounded-lg px-2 py-0.5 text-b2s',
                    position.side === 'long'
                      ? 'bg-green text-background'
                      : 'bg-red text-background',
                  )}
                >
                  {position.side === 'long' ? t('yieldPlus.long') : t('yieldPlus.short')}
                </span>
              </td>

              <td className="py-4 px-4 text-right">
                <span className="text-b1r text-white">
                  {position.collateralAmount} {position.collateralToken.symbol}
                </span>
              </td>

              <td className="py-4 px-4 text-right">
                <span className="text-b1r text-white">{position.leverage}x</span>
              </td>

              <td className="py-4 px-4 text-right">
                <span className="text-b1r text-white">${position.entryPrice}</span>
              </td>

              <td className="py-4 px-4 text-right">
                <span
                  className={cn(
                    'text-b1s',
                    position.pnlPercentage >= 0 ? 'text-green' : 'text-red',
                  )}
                >
                  {position.pnl} ({position.pnlPercentage >= 0 ? '+' : ''}
                  {position.pnlPercentage.toFixed(2)}%)
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
