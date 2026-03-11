import { cn } from '@venusprotocol/ui';
import { TokenIcon } from 'components';
import { useTranslation } from 'libs/translations';
import type { Token } from 'types';

export interface PairStatsBarProps {
  longToken: Token;
  shortToken: Token;
  price: string;
  priceChange24h: number;
  longLiquidity: string;
  shortLiquidity: string;
  supplyApy: number;
  borrowApy: number;
  className?: string;
}

const StatItem: React.FC<{
  label: string;
  value: React.ReactNode;
}> = ({ label, value }) => (
  <div className="flex flex-col gap-y-1">
    <span className="text-b2r text-grey whitespace-nowrap">{label}</span>
    <span className="text-b1s whitespace-nowrap">{value}</span>
  </div>
);

export const PairStatsBar: React.FC<PairStatsBarProps> = ({
  longToken,
  shortToken,
  price,
  priceChange24h,
  longLiquidity,
  shortLiquidity,
  supplyApy,
  borrowApy,
  className,
}) => {
  const { t } = useTranslation();

  const priceChangePositive = priceChange24h >= 0;
  const priceChangeFormatted = `${priceChangePositive ? '+' : ''}${priceChange24h.toFixed(2)}%`;

  return (
    <div className={cn('flex items-center gap-x-4', className)}>
      {/* Left: pair icons + price */}
      <div className="flex flex-1 items-center gap-x-2 min-w-0">
        {/* Overlapping 32px token icons */}
        <div className="flex items-center shrink-0 pr-2">
          <TokenIcon token={longToken} className="size-8 shrink-0" />
          <TokenIcon token={shortToken} className="-ml-2 size-8 shrink-0" />
        </div>

        <span className="text-p3s text-white whitespace-nowrap">
          {longToken.symbol}/{shortToken.symbol}
        </span>

        <span className="text-p3s text-white whitespace-nowrap">{price}</span>

        <span
          className={cn(
            'text-b1s whitespace-nowrap',
            priceChangePositive ? 'text-green' : 'text-red',
          )}
        >
          {priceChangeFormatted}
        </span>
      </div>

      {/* Right: stats spread evenly */}
      <div className="flex flex-1 items-center justify-between min-w-0">
        <StatItem label={t('yieldPlus.pairStats.longLiquidity')} value={longLiquidity} />

        <StatItem label={t('yieldPlus.pairStats.shortLiquidity')} value={shortLiquidity} />

        <StatItem
          label={t('yieldPlus.pairStats.supplyApy', { token: longToken.symbol })}
          value={<span className="text-green">{supplyApy.toFixed(2)}%</span>}
        />

        <StatItem
          label={t('yieldPlus.pairStats.borrowApy', { token: shortToken.symbol })}
          value={<span className="text-yellow">{borrowApy.toFixed(2)}%</span>}
        />
      </div>
    </div>
  );
};
