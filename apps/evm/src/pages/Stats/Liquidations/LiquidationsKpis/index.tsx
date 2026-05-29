import {
  useGetRiskDashboardLiquidationsSummary,
  useGetRiskDashboardWalletAggregates,
} from 'clients/api';
import { Card, Spinner } from 'components';
import { useTranslation } from 'libs/translations';
import { formatCentsToReadableValue } from 'utilities';

interface KpiCellProps {
  label: string;
  value: string;
}

const KpiCell: React.FC<KpiCellProps> = ({ label, value }) => (
  <div className="flex flex-col gap-y-1 min-w-0">
    <span className="text-b1r text-grey truncate">{label}</span>
    <span className="text-p3s text-white truncate">{value}</span>
  </div>
);

const formatInteger = (value: string) => Number.parseInt(value, 10).toLocaleString('en-US');

export interface LiquidationsKpisProps {
  days: number;
}

export const LiquidationsKpis: React.FC<LiquidationsKpisProps> = ({ days }) => {
  const { t } = useTranslation();
  const summary = useGetRiskDashboardLiquidationsSummary({ days });
  const walletAggregates = useGetRiskDashboardWalletAggregates();

  if (summary.isLoading || walletAggregates.isLoading) {
    return (
      <div className="w-full min-h-32 flex items-center justify-center">
        <Spinner />
      </div>
    );
  }

  if (summary.isError || !summary.data) {
    return <p className="text-grey">{t('statsPage.liquidations.kpis.unavailable')}</p>;
  }

  return (
    <Card className="p-4 sm:p-6">
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6 sm:gap-6">
        <KpiCell
          label={t('statsPage.liquidations.kpis.count')}
          value={formatInteger(summary.data.count)}
        />
        <KpiCell
          label={t('statsPage.liquidations.kpis.debtRepaid')}
          value={formatCentsToReadableValue({ value: summary.data.debtRepaidUsdCents })}
        />
        <KpiCell
          label={t('statsPage.liquidations.kpis.collateralSeized')}
          value={formatCentsToReadableValue({ value: summary.data.collateralSeizedUsdCents })}
        />
        <KpiCell
          label={t('statsPage.liquidations.kpis.bonus')}
          value={formatCentsToReadableValue({ value: summary.data.bonusUsdCents })}
        />
        <KpiCell
          label={t('statsPage.liquidations.kpis.activeLiquidators')}
          value={formatInteger(summary.data.activeLiquidators)}
        />
        <KpiCell
          label={t('statsPage.liquidations.kpis.walletsWithBadDebt')}
          value={
            walletAggregates.data ? formatInteger(walletAggregates.data.walletsWithBadDebt) : '—'
          }
        />
      </div>
    </Card>
  );
};
