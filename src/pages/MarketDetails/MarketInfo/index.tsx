/** @jsxImportSource @emotion/react */
import React from 'react';

import { LabeledInlineContent } from 'components';
import { useTranslation } from 'translation';
import { IStat } from '../types';
import Card from '../Card';
import { useStyles } from './styles';

export interface IMarketInfoProps {
  stats: IStat[];
  'data-testid'?: string;
}

const MarketInfo: React.FC<IMarketInfoProps> = ({ stats, ...containerProps }) => {
  const { t } = useTranslation();
  const styles = useStyles();

  return (
    <Card title={t('marketDetails.marketInfo.title')} {...containerProps}>
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
