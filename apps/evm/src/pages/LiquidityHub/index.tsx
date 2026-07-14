import BigNumber from 'bignumber.js';

// TODO: fetch from API
import { liquidityHubs } from '__mocks__/models/liquidityHubs';
import { type CellProps, Page, PageStatHeader } from 'components';
import { useTranslation } from 'libs/translations';
import { formatCentsToReadableValue } from 'utilities';
import { LiquidityHubTable } from './LiquidityHubTable';

const LiquidityHub: React.FC = () => {
  const { t } = useTranslation();

  const { supplyBalanceCents, liquidityCents, count } = liquidityHubs.reduce(
    (acc, liquidityHub) => ({
      ...acc,
      supplyBalanceCents: acc.supplyBalanceCents.plus(liquidityHub.supplyBalanceCents),
      liquidityCents: acc.liquidityCents.plus(liquidityHub.liquidityCents),
      count: acc.count + 1,
    }),
    {
      supplyBalanceCents: new BigNumber(0),
      liquidityCents: new BigNumber(0),
      count: 0,
    },
  );

  const cells: CellProps[] = [
    {
      label: t('liquidityHub.stats.totalSupply'),
      value: formatCentsToReadableValue({
        value: supplyBalanceCents,
      }),
    },
    {
      label: t('liquidityHub.stats.totalLiquidity'),
      value: formatCentsToReadableValue({
        value: liquidityCents,
      }),
    },
    {
      label: t('liquidityHub.stats.hubs'),
      value: count,
    },
  ];

  return (
    <Page>
      <div className="space-y-5 sm:space-y-12">
        <PageStatHeader
          title={t('liquidityHub.header')}
          description={t('liquidityHub.description')}
          cells={cells}
        />

        <LiquidityHubTable data={liquidityHubs} />
      </div>
    </Page>
  );
};

export default LiquidityHub;
