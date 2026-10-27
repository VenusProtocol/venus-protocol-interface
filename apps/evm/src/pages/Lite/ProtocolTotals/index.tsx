import { cn } from '@venusprotocol/ui';
import BigNumber from 'bignumber.js';
import { useTranslation } from 'libs/translations';
import { formatCentsToReadableValue } from 'utilities';
import type { LiteEarnAsset } from '../types';

export interface ProtocolTotalsProps {
  earnAssets: LiteEarnAsset[];
  isReady: boolean;
}

const sumCents = (earnAssets: LiteEarnAsset[], field: 'supplyCents' | 'liquidityCents') =>
  earnAssets.reduce((total, earnAsset) => total.plus(earnAsset[field]), new BigNumber(0));

export const ProtocolTotals: React.FC<ProtocolTotalsProps> = ({ earnAssets, isReady }) => {
  const { t } = useTranslation();

  const totals = [
    {
      key: 'supply' as const,
      label: t('lite.totals.totalSupply'),
      valueCents: sumCents(earnAssets, 'supplyCents'),
      dotClassName: 'bg-green',
    },
    {
      key: 'liquidity' as const,
      label: t('lite.totals.availableLiquidity'),
      valueCents: sumCents(earnAssets, 'liquidityCents'),
      dotClassName: 'bg-yellow',
    },
  ];

  return (
    <div className="lite-enter lite-enter--totals grid w-full max-w-192 grid-cols-1 gap-2 sm:grid-cols-2">
      {totals.map(total => (
        <div
          key={total.key}
          className="flex flex-wrap items-center justify-center gap-x-2 gap-y-1 rounded-lg border border-border-raised bg-cards/78 px-3 py-1 shadow-raised backdrop-blur-raised backdrop-saturate-[1.3]"
        >
          <p className="flex items-center gap-2 text-b1r text-light-grey">
            <span aria-hidden="true" className={cn('size-1.5 rounded-full', total.dotClassName)} />
            {total.label}
          </p>

          <p className="text-p3s tabular-nums">
            {isReady
              ? formatCentsToReadableValue({
                  value: total.valueCents,
                  shorten: false,
                  maxDecimalPlaces: 0,
                })
              : '—'}
          </p>
        </div>
      ))}
    </div>
  );
};
