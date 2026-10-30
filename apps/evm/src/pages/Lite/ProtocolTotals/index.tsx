import { cn, pointerLightClassNames } from '@venusprotocol/ui';
import { useGetLiteTotals } from 'clients/api';
import { useTranslation } from 'libs/translations';
import { formatCentsToReadableValue } from 'utilities';

export const ProtocolTotals: React.FC = () => {
  const { t } = useTranslation();
  const { data } = useGetLiteTotals();

  const totals = [
    {
      key: 'supply' as const,
      label: t('lite.totals.totalSupply'),
      valueCents: data?.totalSupplyCents,
      dotClassName: 'bg-green',
    },
    {
      key: 'liquidity' as const,
      label: t('lite.totals.availableLiquidity'),
      valueCents: data?.availableLiquidityCents,
      dotClassName: 'bg-yellow',
    },
  ];

  return (
    <div className="lite-enter lite-enter--totals grid w-full max-w-192 grid-cols-2 gap-2">
      {totals.map(total => (
        <div
          key={total.key}
          data-pointer-light=""
          className={cn(
            'flex min-h-9 flex-wrap items-center justify-center gap-x-2 gap-y-1 rounded-lg border border-border-raised bg-cards/78 px-3 py-1 shadow-raised backdrop-blur-raised backdrop-saturate-[1.3]',
            pointerLightClassNames,
          )}
        >
          <p className="flex items-center gap-2 text-b1r text-light-grey">
            <span aria-hidden="true" className={cn('size-1.5 rounded-full', total.dotClassName)} />
            {total.label}
          </p>

          <p className="text-p3s tabular-nums">
            {total.valueCents
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
