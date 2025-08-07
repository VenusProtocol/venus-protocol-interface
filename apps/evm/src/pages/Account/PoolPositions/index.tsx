/** @jsxImportSource @emotion/react */
import { useMemo, useState } from 'react';

import { type Tag, TagGroup } from 'components';
import type { Pool } from 'types';

import { PoolSummary } from '../PoolSummary';
import { PoolTagContent } from './PoolTagContent';
import Tables from './Tables';
import { useStyles } from './styles';

export interface PoolPositionsProps {
  pools: Pool[];
  className?: string;
}

export const PoolPositions: React.FC<PoolPositionsProps> = ({ pools, className }) => {
  const styles = useStyles();
  const [selectedPoolIndex, setSelectedPoolIndex] = useState<number>(0);
  const selectedPool = pools[selectedPoolIndex];

  const tags: Tag[] = useMemo(
    () =>
      pools.map(pool => ({
        id: pool.comptrollerAddress,
        content: <PoolTagContent pool={pool} />,
      })),
    [pools],
  );

  const hasBorrowBalance = selectedPool?.userBorrowBalanceCents?.isGreaterThan(0);

  return (
    <div className={className}>
      {pools.length > 0 && (
        <TagGroup
          css={styles.tags}
          tags={tags}
          activeTagIndex={selectedPoolIndex}
          onTagClick={setSelectedPoolIndex}
        />
      )}

      <PoolSummary
        pools={[selectedPool]}
        displayHealthFactor={hasBorrowBalance}
        displayAccountHealth={hasBorrowBalance}
        css={styles.summary}
      />

      <Tables pool={selectedPool} />
    </div>
  );
};
