/** @jsxImportSource @emotion/react */
import { Typography } from '@mui/material';
import React from 'react';
import { Pool } from 'types';
import { isFeatureEnabled } from 'utilities';

import Summary from '../Summary';
import Tables from './Tables';
import { useStyles } from './styles';
import TEST_IDS from './testIds';

export interface PoolBreakdownProps {
  pool: Pool;
  className?: string;
}

export const PoolBreakdown: React.FC<PoolBreakdownProps> = ({ pool, className }) => {
  const styles = useStyles();

  return (
    <div className={className}>
      {isFeatureEnabled('isolatedPools') && (
        <div css={styles.title} data-testid={TEST_IDS.title}>
          <Typography css={styles.marketName} variant="h3">
            {pool.name}
          </Typography>
        </div>
      )}

      <Summary pools={[pool]} displayAccountHealth css={styles.summary} />

      <Tables pool={pool} />
    </div>
  );
};

export default PoolBreakdown;
