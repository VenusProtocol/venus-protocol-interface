/** @jsxImportSource @emotion/react */
import { useMemo, useState } from 'react';

import { type Tag, TagGroup } from 'components';
import { useTranslation } from 'libs/translations';
import type { Pool } from 'types';

import Section from '../../Section';
import Summary from '../Summary';
import { PoolTagContent } from './PoolTagContent';
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
        content: <PoolTagContent pool={pool} />,
      })),
    [pools],
  );

  return (
    <Section className={className} title={t('account.poolsBreakdown.title')}>
      {pools.length > 0 && (
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
