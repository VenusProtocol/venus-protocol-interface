import { useGetLiquidityHubs, useGetLiteTotals } from 'clients/api';
import { Page } from 'components';
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

  const totals = [
    { label: t('lite.totals.totalSupply'), valueCents: getLiteTotalsData?.totalSupplyCents },
    {
      label: t('lite.totals.availableLiquidity'),
      valueCents: getLiteTotalsData?.availableLiquidityCents,
    },
  ];

  return (
    <Page>
      <div className="space-y-5 sm:space-y-12">
        <div className="flex flex-col gap-8 xl:flex-row xl:items-start xl:justify-between">
          <div className="xl:max-w-140">
            <h1 className="venus-page-title">{t('liquidityHubs.header')}</h1>

            <p className="mt-4 text-base text-light-grey">{t('liquidityHubs.description')}</p>
          </div>

          <div className="flex shrink-0 flex-wrap gap-8 sm:gap-12">
            {totals.map(total => (
              <div key={total.label}>
                <p className="mb-3 text-sm text-light-grey">{total.label}</p>

                <p className="text-3xl font-normal tabular-nums xl:text-4xl">
                  {total.valueCents ? formatCentsToReadableValue({ value: total.valueCents }) : '—'}
                </p>
              </div>
            ))}
          </div>
        </div>

        <LiquidityHubTable data={getLiquidityHubsData.liquidityHubs} isFetching={isLoading} />
      </div>
    </Page>
  );
};

export default LiquidityHubs;
