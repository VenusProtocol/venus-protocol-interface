import BigNumber from 'bignumber.js';

import { useGetLiquidityHubs } from 'clients/api';
import { type CellProps, Page, PageStatHeader } from 'components';
import { PLACEHOLDER_KEY } from 'constants/placeholders';
import { useTranslation } from 'libs/translations';
import { useAccountAddress } from 'libs/wallet';
import { formatCentsToReadableValue } from 'utilities';
import { LiquidityHubTable } from './LiquidityHubTable';

const LiquidityHubs: React.FC = () => {
  const { accountAddress } = useAccountAddress();

  const { t } = useTranslation();
  const { data: getLiquidityHubsData, isLoading } = useGetLiquidityHubs({
    accountAddress,
  });
  const liquidityHubs = getLiquidityHubsData?.liquidityHubs ?? [];

  const totals = getLiquidityHubsData
    ? liquidityHubs.reduce(
        (acc, liquidityHub) => ({
          supplyBalanceCents: acc.supplyBalanceCents.plus(liquidityHub.supplyBalanceCents),
          liquidityCents: acc.liquidityCents.plus(liquidityHub.liquidityCents),
        }),
        {
          supplyBalanceCents: new BigNumber(0),
          liquidityCents: new BigNumber(0),
        },
      )
    : undefined;

  const cells: CellProps[] = [
    {
      label: t('liquidityHubs.stats.totalSupply'),
      value: formatCentsToReadableValue({
        value: totals?.supplyBalanceCents,
      }),
    },
    {
      label: t('liquidityHubs.stats.totalLiquidity'),
      value: formatCentsToReadableValue({
        value: totals?.liquidityCents,
      }),
    },
    {
      label: t('liquidityHubs.stats.hubs'),
      value: getLiquidityHubsData ? liquidityHubs.length : PLACEHOLDER_KEY,
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

        <LiquidityHubTable data={liquidityHubs} isFetching={isLoading} />
      </div>
    </Page>
  );
};

export default LiquidityHubs;
