/** @jsxImportSource @emotion/react */
import { useMemo, useState } from 'react';

import { type Tag, TagGroup } from 'components';
import type { Pool } from 'types';

import { Summary } from './Summary';
import Tables from './Tables';
import { TagContent } from './TagContent';
import { useStyles } from './styles';

export interface PositionsProps {
  pools: Pool[];
  className?: string;
}

export const Positions: React.FC<PositionsProps> = ({ pools, className }) => {
  const styles = useStyles();
  const [selectedPoolIndex, setSelectedPoolIndex] = useState<number>(0);
  const selectedPool = pools[selectedPoolIndex];

  const tags: Tag[] = useMemo(
    () =>
      pools.map(pool => ({
        id: pool.comptrollerAddress,
        content: <TagContent pool={pool} />,
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

      <Summary
        pool={selectedPool}
        displayHealthFactor={hasBorrowBalance}
        displayAccountHealth={hasBorrowBalance}
        css={styles.summary}
      />

      <Tables pool={selectedPool} />
    </div>
  );
};
