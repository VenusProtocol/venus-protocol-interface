import { useGetRiskDashboardMarketAggregates } from 'clients/api';
import { Card, Spinner } from 'components';
import { useTranslation } from 'libs/translations';
import { formatCentsToReadableValue, formatPercentageToReadableValue } from 'utilities';

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

export const MarketKpis: React.FC = () => {
  const { t } = useTranslation();
  const { data, isLoading, isError } = useGetRiskDashboardMarketAggregates();

  if (isLoading) {
    return <Spinner />;
  }

  if (isError || !data) {
    return <p className="text-grey">{t('statsPage.marketKpis.unavailable')}</p>;
  }

  return (
    <Card className="p-4 sm:p-6">
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 sm:gap-6">
        <KpiCell
          label={t('statsPage.marketKpis.totalSupply')}
          value={formatCentsToReadableValue({ value: data.totalSupplyUsdCents })}
        />
        <KpiCell
          label={t('statsPage.marketKpis.totalBorrows')}
          value={formatCentsToReadableValue({ value: data.totalBorrowsUsdCents })}
        />
        <KpiCell
          label={t('statsPage.marketKpis.liquidity')}
          value={formatCentsToReadableValue({ value: data.liquidityUsdCents })}
        />
        <KpiCell
          label={t('statsPage.marketKpis.utilization')}
          value={formatPercentageToReadableValue(data.utilization * 100)}
        />
      </div>
    </Card>
  );
};
