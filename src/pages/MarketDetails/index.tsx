/** @jsxImportSource @emotion/react */
import React from 'react';

import { useTranslation } from 'translation';
import { formatCentsToReadableValue, formatToReadablePercentage } from 'utilities/common';
import { ApyChart, IApyChartProps, InterestRateChart, IInterestRateChartProps } from 'components';
import { fakeApyChartData, fakeInterestRateChartData } from './mockData';
import MarketInfo from './MarketInfo';
import Card, { IStat, ILegend } from './Card';
import { useStyles } from './styles';

export interface IMarketDetailsUiProps {
  totalBorrowBalanceCents: number;
  borrowApyPercentage: number;
  borrowDistributionApyPercentage: number;
  totalSupplyBalanceCents: number;
  supplyApyPercentage: number;
  supplyDistributionApyPercentage: number;
  currentUtilizationRate: number;
  supplyChartData: IApyChartProps['data'];
  borrowChartData: IApyChartProps['data'];
  interestRateChartData: IInterestRateChartProps['data'];
}

export const MarketDetailsUi: React.FC<IMarketDetailsUiProps> = ({
  totalBorrowBalanceCents,
  borrowApyPercentage,
  borrowDistributionApyPercentage,
  totalSupplyBalanceCents,
  supplyApyPercentage,
  supplyDistributionApyPercentage,
  currentUtilizationRate,
  supplyChartData,
  borrowChartData,
  interestRateChartData,
}) => {
  const { t } = useTranslation();
  const styles = useStyles();

  const supplyInfoStats: IStat[] = [
    {
      label: t('marketDetails.supplyInfo.stats.totalSupply'),
      value: formatCentsToReadableValue({
        value: totalBorrowBalanceCents,
        shorthand: true,
      }),
    },
    {
      label: t('marketDetails.supplyInfo.stats.apy'),
      value: formatToReadablePercentage(borrowApyPercentage),
    },
    {
      label: t('marketDetails.supplyInfo.stats.distributionApy'),
      value: formatToReadablePercentage(borrowDistributionApyPercentage),
    },
  ];

  const supplyInfoLegends: ILegend[] = [
    {
      label: t('marketDetails.legends.supplyApy'),
      color: styles.legendColors.supplyApy,
    },
  ];

  const borrowInfoStats: IStat[] = [
    {
      label: t('marketDetails.borrowInfo.stats.totalBorrow'),
      value: formatCentsToReadableValue({
        value: totalSupplyBalanceCents,
        shorthand: true,
      }),
    },
    {
      label: t('marketDetails.borrowInfo.stats.apy'),
      value: formatToReadablePercentage(supplyApyPercentage),
    },
    {
      label: t('marketDetails.borrowInfo.stats.distributionApy'),
      value: formatToReadablePercentage(supplyDistributionApyPercentage),
    },
  ];

  const borrowInfoLegends: ILegend[] = [
    {
      label: t('marketDetails.legends.borrowApy'),
      color: styles.legendColors.borrowApy,
    },
  ];

  const interestRateModelLegends: ILegend[] = [
    {
      label: t('marketDetails.legends.utilizationRate'),
      color: styles.legendColors.utilizationRate,
    },
    {
      label: t('marketDetails.legends.borrowApy'),
      color: styles.legendColors.borrowApy,
    },
    {
      label: t('marketDetails.legends.supplyApy'),
      color: styles.legendColors.supplyApy,
    },
  ];

  return (
    <div css={styles.container}>
      <div css={[styles.column, styles.graphsColumn]}>
        <Card
          title={t('marketDetails.supplyInfo.title')}
          css={styles.graphCard}
          stats={supplyInfoStats}
          legends={supplyInfoLegends}
        >
          <div css={styles.apyChart}>
            <ApyChart data={supplyChartData} type="supply" />
          </div>
        </Card>

        <Card
          title={t('marketDetails.borrowInfo.title')}
          css={styles.graphCard}
          stats={borrowInfoStats}
          legends={borrowInfoLegends}
        >
          <div css={styles.apyChart}>
            <ApyChart data={borrowChartData} type="borrow" />
          </div>
        </Card>

        <Card
          title={t('marketDetails.interestRateModel.title')}
          css={styles.graphCard}
          legends={interestRateModelLegends}
        >
          <div css={styles.apyChart}>
            <InterestRateChart
              data={interestRateChartData}
              currentUtilizationRate={currentUtilizationRate}
            />
          </div>
        </Card>
      </div>

      <div css={[styles.column, styles.statsColumn]}>
        <MarketInfo />
      </div>
    </div>
  );
};

const MarketDetails: React.FC = () => {
  // TODO: fetch actual data (see https://app.clickup.com/t/29xm9d3 and
  // https://app.clickup.com/t/29xm9ct)
  const totalBorrowBalanceCents = 100000000;
  const borrowApyPercentage = 2.24;
  const borrowDistributionApyPercentage = 1.1;
  const totalSupplyBalanceCents = 100000000000;
  const supplyApyPercentage = 4.56;
  const supplyDistributionApyPercentage = 0.45;
  const currentUtilizationRate = 46;

  return (
    <MarketDetailsUi
      totalBorrowBalanceCents={totalBorrowBalanceCents}
      borrowApyPercentage={borrowApyPercentage}
      borrowDistributionApyPercentage={borrowDistributionApyPercentage}
      totalSupplyBalanceCents={totalSupplyBalanceCents}
      supplyApyPercentage={supplyApyPercentage}
      supplyDistributionApyPercentage={supplyDistributionApyPercentage}
      currentUtilizationRate={currentUtilizationRate}
      supplyChartData={fakeApyChartData}
      borrowChartData={fakeApyChartData}
      interestRateChartData={fakeInterestRateChartData}
    />
  );
};

export default MarketDetails;
