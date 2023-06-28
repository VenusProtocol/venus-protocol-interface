/** @jsxImportSource @emotion/react */
import { TagGroup } from 'components';
import React, { useState } from 'react';
import { useTranslation } from 'translation';
import { Pool } from 'types';
import { isFeatureEnabled } from 'utilities';

import Section from '../Section';
import Summary from '../Summary';
import Tables from './Tables';
import { useStyles } from './styles';

export interface PoolsBreakdownProps {
  pools: Pool[];
  className?: string;
}

export const PoolsBreakdown: React.FC<PoolsBreakdownProps> = ({ pools, className }) => {
  const styles = useStyles();
  const { t } = useTranslation();
  const [selectedPoolIndex, setSelectedPoolIndex] = useState<number>(0);
  const selectedPool = pools[selectedPoolIndex];

  return (
    <Section
      className={className}
      title={isFeatureEnabled('isolatedPools') ? t('account.poolsBreakdown') : selectedPool.name}
    >
      {isFeatureEnabled('isolatedPools') && pools.length > 0 && (
        <TagGroup
          css={styles.tags}
          tagsContent={pools.map(pool => pool.name)}
          activeTagIndex={selectedPoolIndex}
          onTagClick={setSelectedPoolIndex}
        />
      )}

      <Summary pools={[selectedPool]} displayAccountHealth css={styles.summary} />

      <Tables pool={selectedPool} />
    </Section>
  );
};

export default PoolsBreakdown;
