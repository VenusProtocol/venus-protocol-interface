/** @jsxImportSource @emotion/react */
import { LabeledInlineContent } from 'components';
import React from 'react';
import { useTranslation } from 'translation';

import Card from '../Card';
import { Stat } from '../types';
import { useStyles } from './styles';

export interface MarketInfoProps {
  stats: Stat[];
  testId?: string;
}

const MarketInfo: React.FC<MarketInfoProps> = ({ stats, testId }) => {
  const { t } = useTranslation();
  const styles = useStyles();

  return (
    <Card title={t('marketDetails.marketInfo.title')} testId={testId}>
      <ul css={styles.itemList}>
        {stats.map(stat => (
          <li css={styles.item} key={`market-info-stat-${stat.label}`}>
            <LabeledInlineContent label={stat.label}>
              <span css={styles.value}>{stat.value}</span>
            </LabeledInlineContent>
          </li>
        ))}
      </ul>
    </Card>
  );
};

export default MarketInfo;
