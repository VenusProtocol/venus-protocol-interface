import { useGetLiquidityHubs, useGetLiteTotals } from 'clients/api';
import { type CellProps, Page, PageStatHeader } from 'components';
import { useTranslation } from 'libs/translations';
import { useAccountAddress } from 'libs/wallet';
import { formatCentsToReadableValue } from 'utilities';
import { LiquidityHubTable } from './LiquidityHubTable';

const LiquidityHubs: React.FC = () => {
  const { accountAddress } = useAccountAddress();

  const { t } = useTranslation();
  const {
    data: getLiquidityHubsData = {
      liquidityHubs: [],
    },
    isLoading,
  } = useGetLiquidityHubs({
    accountAddress,
  });
  const { data: getLiteTotalsData } = useGetLiteTotals();

  const totals: CellProps[] = [
    { label: t('lite.totals.totalSupply'), valueCents: getLiteTotalsData?.totalSupplyCents },
    {
      label: t('lite.totals.availableLiquidity'),
      valueCents: getLiteTotalsData?.availableLiquidityCents,
    },
  ].map(({ label, valueCents }) => ({
    label,
    value: valueCents ? formatCentsToReadableValue({ value: valueCents }) : '—',
  }));

  return (
    <Page>
      <div className="space-y-5 sm:space-y-12">
        <PageStatHeader
          title={t('liquidityHubs.header')}
          description={t('liquidityHubs.description')}
          cells={totals}
        />

        <LiquidityHubTable data={getLiquidityHubsData.liquidityHubs} isFetching={isLoading} />
      </div>
    </Page>
  );
};

export default LiquidityHubs;
