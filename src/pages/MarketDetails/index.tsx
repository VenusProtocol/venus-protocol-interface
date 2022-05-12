/** @jsxImportSource @emotion/react */
import React from 'react';

import { useTranslation } from 'translation';
import MarketInfo from './MarketInfo';
import Card from './Card';
import { useStyles } from './styles';

export const MarketDetailsUI: React.FC = () => {
  const { t } = useTranslation();
  const styles = useStyles();

  return (
    <div css={styles.container}>
      <div css={[styles.column, styles.graphsColumn]}>
        <Card title={t('marketDetails.supplyInfo.title')} css={styles.graphCard} />

        <Card title={t('marketDetails.borrowInfo.title')} css={styles.graphCard} />
      </div>

      <div css={[styles.column, styles.statsColumn]}>
        <MarketInfo />
      </div>
    </div>
  );
};

const MarketDetails: React.FC = () => <MarketDetailsUI />;

export default MarketDetails;
