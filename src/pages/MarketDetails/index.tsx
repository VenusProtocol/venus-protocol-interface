/** @jsxImportSource @emotion/react */
import React from 'react';

import { useTranslation } from 'translation';
import { formatCentsToReadableValue, formatToReadablePercentage } from 'utilities/common';
import MarketInfo from './MarketInfo';
import Card, { IStat } from './Card';
import { useStyles } from './styles';

export interface IMarketDetailsUiProps {
  totalBorrowBalanceCents: number;
  borrowApyPercentage: number;
  borrowDistributionApyPercentage: number;
  totalSupplyBalanceCents: number;
  supplyApyPercentage: number;
  supplyDistributionApyPercentage: number;
}

export const MarketDetailsUi: React.FC<IMarketDetailsUiProps> = ({
  totalBorrowBalanceCents,
  borrowApyPercentage,
  borrowDistributionApyPercentage,
  totalSupplyBalanceCents,
  supplyApyPercentage,
  supplyDistributionApyPercentage,
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

  return (
    <div css={styles.container}>
      <div css={[styles.column, styles.graphsColumn]}>
        <Card
          title={t('marketDetails.supplyInfo.title')}
          css={styles.graphCard}
          stats={borrowInfoStats}
        />

        <Card
          title={t('marketDetails.borrowInfo.title')}
          css={styles.graphCard}
          stats={supplyInfoStats}
        />
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

  return (
    <MarketDetailsUi
      totalBorrowBalanceCents={totalBorrowBalanceCents}
      borrowApyPercentage={borrowApyPercentage}
      borrowDistributionApyPercentage={borrowDistributionApyPercentage}
      totalSupplyBalanceCents={totalSupplyBalanceCents}
      supplyApyPercentage={supplyApyPercentage}
      supplyDistributionApyPercentage={supplyDistributionApyPercentage}
    />
  );
};

export default MarketDetails;
