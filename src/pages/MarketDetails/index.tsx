/** @jsxImportSource @emotion/react */
import React from 'react';
import BigNumber from 'bignumber.js';

import { useTranslation } from 'translation';
import { formatCentsToReadableValue, formatToReadablePercentage } from 'utilities/common';
import { ApyChart, IApyChartProps } from 'components';
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
  supplyChartData: IApyChartProps['data'];
  borrowChartData: IApyChartProps['data'];
}

export const MarketDetailsUi: React.FC<IMarketDetailsUiProps> = ({
  totalBorrowBalanceCents,
  borrowApyPercentage,
  borrowDistributionApyPercentage,
  totalSupplyBalanceCents,
  supplyApyPercentage,
  supplyDistributionApyPercentage,
  supplyChartData,
  borrowChartData,
}) => {
  const { t } = useTranslation();
  const styles = useStyles();

  const borrowInfoStats: IStat[] = [
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

  const borrowInfoLegends: ILegend[] = [
    {
      label: t('marketDetails.supplyInfo.legends.supplyApy'),
      color: styles.legendColors.supplyApy,
    },
  ];

  const supplyInfoStats: IStat[] = [
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

  const supplyInfoLegends: ILegend[] = [
    {
      label: t('marketDetails.supplyInfo.legends.borrowApy'),
      color: styles.legendColors.borrowApy,
    },
  ];

  return (
    <div css={styles.container}>
      <div css={[styles.column, styles.graphsColumn]}>
        <Card
          title={t('marketDetails.supplyInfo.title')}
          css={styles.graphCard}
          stats={borrowInfoStats}
          legends={borrowInfoLegends}
        >
          <div css={styles.apyChart}>
            <ApyChart data={supplyChartData} type="supply" />
          </div>
        </Card>

        <Card
          title={t('marketDetails.borrowInfo.title')}
          css={styles.graphCard}
          stats={supplyInfoStats}
          legends={supplyInfoLegends}
        >
          <div css={styles.apyChart}>
            <ApyChart data={borrowChartData} type="borrow" />
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

  const supplyChartData: IApyChartProps['data'] = [
    {
      apyPercentage: 40,
      timestampMs: new Date('2022-05-03T10:59:44.330Z').getTime(),
      balanceCents: new BigNumber(10000),
    },
    {
      apyPercentage: 30,
      timestampMs: new Date('2022-05-04T10:59:44.330Z').getTime(),
      balanceCents: new BigNumber(10000000),
    },
    {
      apyPercentage: 20,
      timestampMs: new Date('2022-05-05T10:59:44.330Z').getTime(),
      balanceCents: new BigNumber(100000),
    },
    {
      apyPercentage: 27,
      timestampMs: new Date('2022-05-06T10:59:44.330Z').getTime(),
      balanceCents: new BigNumber(100000),
    },
    {
      apyPercentage: 18,
      timestampMs: new Date('2022-05-07T10:59:44.330Z').getTime(),
      balanceCents: new BigNumber(10000000000),
    },
    {
      apyPercentage: 23,
      timestampMs: new Date('2022-05-08T10:59:44.330Z').getTime(),
      balanceCents: new BigNumber(10000000),
    },
    {
      apyPercentage: 34,
      timestampMs: new Date('2022-05-09T10:59:44.330Z').getTime(),
      balanceCents: new BigNumber(100000),
    },
  ];

  const borrowChartData: IApyChartProps['data'] = [
    {
      apyPercentage: 40,
      timestampMs: new Date('2022-05-03T10:59:44.330Z').getTime(),
      balanceCents: new BigNumber(10000),
    },
    {
      apyPercentage: 30,
      timestampMs: new Date('2022-05-04T10:59:44.330Z').getTime(),
      balanceCents: new BigNumber(10000000),
    },
    {
      apyPercentage: 20,
      timestampMs: new Date('2022-05-05T10:59:44.330Z').getTime(),
      balanceCents: new BigNumber(100000),
    },
    {
      apyPercentage: 27,
      timestampMs: new Date('2022-05-06T10:59:44.330Z').getTime(),
      balanceCents: new BigNumber(100000),
    },
    {
      apyPercentage: 18,
      timestampMs: new Date('2022-05-07T10:59:44.330Z').getTime(),
      balanceCents: new BigNumber(10000000000),
    },
    {
      apyPercentage: 23,
      timestampMs: new Date('2022-05-08T10:59:44.330Z').getTime(),
      balanceCents: new BigNumber(10000000),
    },
    {
      apyPercentage: 34,
      timestampMs: new Date('2022-05-09T10:59:44.330Z').getTime(),
      balanceCents: new BigNumber(100000),
    },
  ];

  return (
    <MarketDetailsUi
      totalBorrowBalanceCents={totalBorrowBalanceCents}
      borrowApyPercentage={borrowApyPercentage}
      borrowDistributionApyPercentage={borrowDistributionApyPercentage}
      totalSupplyBalanceCents={totalSupplyBalanceCents}
      supplyApyPercentage={supplyApyPercentage}
      supplyDistributionApyPercentage={supplyDistributionApyPercentage}
      supplyChartData={supplyChartData}
      borrowChartData={borrowChartData}
    />
  );
};

export default MarketDetails;
