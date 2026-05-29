import { useGetRiskDashboardWalletAggregates } from 'clients/api';
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

export const WalletKpis: React.FC = () => {
  const { t } = useTranslation();
  const { data, isLoading, isError } = useGetRiskDashboardWalletAggregates();

  if (isLoading) {
    return <Spinner />;
  }

  if (isError || !data) {
    return <p className="text-grey">{t('statsPage.walletKpis.unavailable')}</p>;
  }

  return (
    <Card className="p-4 sm:p-6">
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-6 lg:grid-cols-3 xl:grid-cols-5">
        <KpiCell
          label={t('statsPage.walletKpis.totalSuppliers')}
          value={formatInteger(data.totalSuppliers)}
        />
        <KpiCell
          label={t('statsPage.walletKpis.suppliersWithPositionAboveMinUsdValue')}
          value={formatInteger(data.suppliersWithPositionAboveMinUsdValue)}
        />
        <KpiCell
          label={t('statsPage.walletKpis.totalBorrowers')}
          value={formatInteger(data.totalBorrowers)}
        />
        <KpiCell
          label={t('statsPage.walletKpis.borrowersWithPositionAboveMinUsdValue')}
          value={formatInteger(data.borrowersWithPositionAboveMinUsdValue)}
        />
        <KpiCell
          label={t('statsPage.walletKpis.walletsAtRisk')}
          value={formatInteger(data.walletsAtRisk)}
        />
        <KpiCell
          label={t('statsPage.walletKpis.eligibleForLiquidation')}
          value={formatInteger(data.walletsEligibleForLiquidation)}
        />
        <KpiCell
          label={t('statsPage.walletKpis.valueEligibleForLiquidation')}
          value={formatCentsToReadableValue({ value: data.valueEligibleForLiquidationUsdCents })}
        />
        <KpiCell
          label={t('statsPage.walletKpis.totalCollateralAtRisk')}
          value={formatCentsToReadableValue({ value: data.totalCollateralAtRiskUsdCents })}
        />
        <KpiCell
          label={t('statsPage.walletKpis.totalBadDebt')}
          value={formatCentsToReadableValue({ value: data.totalBadDebtUsdCents })}
        />
      </div>
    </Card>
  );
};
