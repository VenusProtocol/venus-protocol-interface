import BigNumber from 'bignumber.js';

// TODO: fetch from API
import { liquidityHubs } from '__mocks__/models/liquidityHubs';
import { type CellProps, Page, PageStatHeader } from 'components';
import { useTranslation } from 'libs/translations';
import { formatCentsToReadableValue } from 'utilities';
import { LiquidityHubTable } from './LiquidityHubTable';

const LiquidityHubs: React.FC = () => {
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
      label: t('liquidityHubs.stats.totalSupply'),
      value: formatCentsToReadableValue({
        value: supplyBalanceCents,
      }),
    },
    {
      label: t('liquidityHubs.stats.totalLiquidity'),
      value: formatCentsToReadableValue({
        value: liquidityCents,
      }),
    },
    {
      label: t('liquidityHubs.stats.hubs'),
      value: count,
    },
  ];

  return (
    <Page>
      <div className="space-y-5 sm:space-y-12">
        <PageStatHeader
          title={t('liquidityHubs.header')}
          description={t('liquidityHubs.description')}
          cells={cells}
        />

        <LiquidityHubTable data={liquidityHubs} />
      </div>
    </Page>
  );
};

export default LiquidityHubs;
