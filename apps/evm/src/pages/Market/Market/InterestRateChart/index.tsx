import { useGetVTokenApySimulations } from 'clients/api';
import { Spinner } from 'components';
import { InterestRateChart as InterestRateChartUi } from 'components/charts/InterestRateChart';
import { useTranslation } from 'libs/translations';
import type { Asset } from 'types';
import TEST_IDS from '../../testIds';
import { MarketCard, type MarketCardProps } from '../MarketCard';

export interface InterestRateChartProps {
  className?: string;
  asset: Asset;
  isIsolatedPoolMarket: boolean;
}

export const InterestRateChart: React.FC<InterestRateChartProps> = ({
  asset,
  className,
  isIsolatedPoolMarket,
}) => {
  const { t } = useTranslation();
  const {
    isLoading: isInterestRateChartDataLoading,
    data: interestRateChartData = {
      apySimulations: [],
      currentUtilizationRatePercentage: 0,
    },
  } = useGetVTokenApySimulations({
    vToken: asset.vToken,
    isIsolatedPoolMarket,
    asset,
  });

  const legends: MarketCardProps['legends'] = [
    {
      label: t('market.legends.utilizationRate'),
      color: 'blue',
    },
    {
      label: t('market.legends.borrowApy'),
      color: 'red',
    },
    {
      label: t('market.legends.supplyApy'),
      color: 'green',
    },
  ];

  return (
    <MarketCard
      className={className}
      testId={TEST_IDS.interestRateModel}
      title={t('market.interestRateModel.title')}
      legends={legends}
    >
      {isInterestRateChartDataLoading && interestRateChartData.apySimulations.length === 0 && (
        <Spinner />
      )}

      {interestRateChartData.apySimulations.length > 0 && (
        <div className="-mr-[10px]">
          <InterestRateChartUi
            data={interestRateChartData.apySimulations}
            currentUtilizationRatePercentage={
              interestRateChartData.currentUtilizationRatePercentage
            }
          />
        </div>
      )}
    </MarketCard>
  );
};
