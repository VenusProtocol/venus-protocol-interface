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
    },
    {
      key: 'liquidity' as const,
      label: t('lite.totals.availableLiquidity'),
      valueCents: data?.availableLiquidityCents,
    },
  ];

  return (
    <div className="lite-enter lite-enter--totals relative z-21 grid w-full max-w-192 grid-cols-2 gap-2">
      {totals.map(total => (
        <div
          key={total.key}
          className="flex min-h-9 flex-col items-center justify-center gap-x-2 gap-y-0.5 rounded-lg sm:flex-row border border-border-raised bg-cards/78 px-3 py-1 shadow-raised backdrop-blur-raised backdrop-saturate-[1.3]"
        >
          <p className="text-b1r text-light-grey">{total.label}</p>

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
