/** @jsxImportSource @emotion/react */
import { ProgressCircle, Tag, TagGroup, Tooltip } from 'components';
import React, { useMemo, useState } from 'react';
import { useTranslation } from 'translation';
import { Pool } from 'types';
import { calculatePercentage, formatToReadablePercentage, isFeatureEnabled } from 'utilities';

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
      pools.map(pool => {
        const borrowLimitUsedPercentage =
          pool.userBorrowBalanceCents &&
          pool.userBorrowLimitCents &&
          calculatePercentage({
            numerator: pool.userBorrowBalanceCents.toNumber(),
            denominator: pool.userBorrowLimitCents.toNumber(),
          });

        const readableBorrowLimitUsedPercentage =
          formatToReadablePercentage(borrowLimitUsedPercentage);

        return {
          id: pool.comptrollerAddress,
          content: (
            <>
              <span>{pool.name}</span>

              {borrowLimitUsedPercentage !== undefined && (
                <Tooltip
                  title={t('account.poolsBreakdown.poolTagTooltip', {
                    borrowLimitUsedPercentage: readableBorrowLimitUsedPercentage,
                  })}
                  css={styles.tagTooltip}
                >
                  <ProgressCircle value={borrowLimitUsedPercentage} />
                </Tooltip>
              )}
            </>
          ),
        };
      }),
    [pools],
  );

  return (
    <Section
      className={className}
      title={
        isFeatureEnabled('isolatedPools') ? t('account.poolsBreakdown.title') : selectedPool.name
      }
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
