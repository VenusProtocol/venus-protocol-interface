/** @jsxImportSource @emotion/react */
import React from 'react';
import { Pool } from 'types';
import { isFeatureEnabled } from 'utilities';

import Section from '../Section';
import Summary from '../Summary';
import Tables from './Tables';
import { useStyles } from './styles';

export interface PoolBreakdownProps {
  pool: Pool;
  className?: string;
}

export const PoolBreakdown: React.FC<PoolBreakdownProps> = ({ pool, className }) => {
  const styles = useStyles();

  return (
    <Section className={className} title={pool.name}>
      {isFeatureEnabled('isolatedPools') && (
        <Summary pools={[pool]} displayAccountHealth css={styles.summary} />
      )}

      <Tables pool={pool} />
    </Section>
  );
};

export default PoolBreakdown;
