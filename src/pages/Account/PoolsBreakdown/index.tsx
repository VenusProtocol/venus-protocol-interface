/** @jsxImportSource @emotion/react */
import { ProgressCircle, Tag, TagGroup } from 'components';
import React, { useMemo, useState } from 'react';
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

  const tags: Tag[] = useMemo(
    () =>
      pools.map(pool => ({
        id: pool.comptrollerAddress,
        content: (
          <>
            <span css={styles.tagText}>{pool.name}</span>

            <ProgressCircle value={75} />
          </>
        ),
      })),
    [pools],
  );

  return (
    <Section
      className={className}
      title={isFeatureEnabled('isolatedPools') ? t('account.poolsBreakdown') : selectedPool.name}
    >
      {isFeatureEnabled('isolatedPools') && pools.length > 0 && (
        <TagGroup
          css={styles.tags}
          tags={tags}
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
