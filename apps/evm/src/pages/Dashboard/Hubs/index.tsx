import BigNumber from 'bignumber.js';
import type { CellProps } from 'components';
import { routes } from 'constants/routing';
import { DAYS_PER_YEAR } from 'constants/time';
import { HidableUserBalance } from 'containers/HidableUserBalance';
import { useAnalytics } from 'libs/analytics';
import { useTranslation } from 'libs/translations';
import type { LiquidityHub } from 'types';
import { formatCentsToReadableValue } from 'utilities';
import { PositionCardsTab } from '../PositionCardsTab';
import { LiquidityHubCard } from './LiquidityHubCard';

export interface HubsProps {
  liquidityHubs: LiquidityHub[];
}

export const Hubs: React.FC<HubsProps> = ({ liquidityHubs }) => {
  const { t } = useTranslation();
  const { captureAnalyticEvent } = useAnalytics();

  const { supplyBalanceCents, dailyEarningsCents } = liquidityHubs.reduce(
    (acc, liquidityHub) => {
      const userSupplyBalanceTokens = liquidityHub.userSupplyBalanceTokens ?? new BigNumber(0);
      const userSupplyBalanceCents = liquidityHub.userSupplyBalanceCents ?? new BigNumber(0);

      if (!userSupplyBalanceTokens.isGreaterThan(0) && !userSupplyBalanceCents.isGreaterThan(0)) {
        return acc;
      }

      return {
        supplyBalanceCents: acc.supplyBalanceCents.plus(userSupplyBalanceCents),
        dailyEarningsCents: acc.dailyEarningsCents.plus(
          (liquidityHub.userYearlyEarningsCents ?? new BigNumber(0)).dividedBy(DAYS_PER_YEAR),
        ),
      };
    },
    { supplyBalanceCents: new BigNumber(0), dailyEarningsCents: new BigNumber(0) },
  );

  const summaryCells: CellProps[] = [
    {
      label: t('dashboard.hubs.totalSuppliedValue'),
      value: (
        <HidableUserBalance>
          {formatCentsToReadableValue({ value: supplyBalanceCents })}
        </HidableUserBalance>
      ),
    },
    {
      label: t('dashboard.hubs.dailyEarnings'),
      value: (
        <HidableUserBalance>
          {formatCentsToReadableValue({ value: dailyEarningsCents })}
        </HidableUserBalance>
      ),
      tooltip: t('dashboard.hubs.dailyEarningsTooltip'),
    },
  ];

  return (
    <PositionCardsTab
      items={liquidityHubs}
      activePositionFilter={liquidityHub =>
        liquidityHub.userSupplyBalanceCents?.isGreaterThan(0) === true ||
        liquidityHub.userSupplyBalanceTokens?.isGreaterThan(0) === true
      }
      summaryCells={summaryCells}
      placeholderIconName="hub"
      placeholderTitle={t('account.hubs.placeholder.title')}
      placeholderRoute={routes.liquidityHubs.path}
      placeholderOnClick={() =>
        captureAnalyticEvent('hub_navigation', {
          variant: 'dashboard_hubs_tabs_placeholder',
        })
      }
      renderCard={(liquidityHub, isPreview) => (
        <LiquidityHubCard
          liquidityHub={liquidityHub}
          to={
            isPreview
              ? routes.liquidityHub.path.replace(':vhTokenAddress', liquidityHub.vhToken.address)
              : undefined
          }
        />
      )}
      getKey={liquidityHub => liquidityHub.vhToken.address}
    />
  );
};
