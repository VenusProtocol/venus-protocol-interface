import { cn } from '@venusprotocol/ui';
import { TokenIcon } from 'components/TokenIcon';
import { useTranslation } from 'libs/translations';
import type { Token } from 'types';

export interface PairInfoBarProps {
  longToken: Token;
  shortToken: Token;
  longLiquidityUsd?: string;
  shortLiquidityUsd?: string;
  longSupplyApyPercentage?: string;
  shortBorrowApyPercentage?: string;
  className?: string;
}

interface StatItemProps {
  label: string;
  value: string;
  valueClassName?: string;
}

const StatItem: React.FC<StatItemProps> = ({ label, value, valueClassName }) => (
  <div className="flex flex-col gap-0.5 shrink-0">
    <span className="text-b2r text-grey whitespace-nowrap">{label}</span>
    <span className={cn('text-b1s text-white', valueClassName)}>{value}</span>
  </div>
);

export const PairInfoBar: React.FC<PairInfoBarProps> = ({
  longToken,
  shortToken,
  longLiquidityUsd = '-',
  shortLiquidityUsd = '-',
  longSupplyApyPercentage = '-',
  shortBorrowApyPercentage = '-',
  className,
}) => {
  const { t } = useTranslation();

  return (
    <div
      className={cn(
        'flex items-center justify-between gap-4 rounded-xl bg-cards border border-lightGrey px-4 py-3 overflow-x-auto',
        className,
      )}
    >
      {/* Pair icons + symbols */}
      <div className="flex items-center gap-2 shrink-0 mr-2">
        <div className="flex items-center">
          <TokenIcon token={longToken} className="size-6 z-10" />
          <TokenIcon token={shortToken} className="size-6 -ml-2" />
        </div>
        <span className="text-b1s text-white whitespace-nowrap">
          {longToken.symbol}/{shortToken.symbol}
        </span>
      </div>

      <div className="w-px h-8 bg-lightGrey shrink-0" />

      <StatItem
        label={t('yieldPlus.pairInfoBar.longLiquidity')}
        value={longLiquidityUsd}
        valueClassName="text-green"
      />

      <StatItem
        label={t('yieldPlus.pairInfoBar.shortLiquidity')}
        value={shortLiquidityUsd}
        valueClassName="text-red"
      />

      <StatItem
        label={t('yieldPlus.pairInfoBar.supplyApy', { symbol: longToken.symbol })}
        value={longSupplyApyPercentage}
        valueClassName="text-green"
      />

      <StatItem
        label={t('yieldPlus.pairInfoBar.borrowApy', { symbol: shortToken.symbol })}
        value={shortBorrowApyPercentage}
        valueClassName="text-green"
      />
    </div>
  );
};
