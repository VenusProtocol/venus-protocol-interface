/** @jsxImportSource @emotion/react */
import React from 'react';

import MarketInfo from './MarketInfo';
import { useStyles } from './styles';

const MarketDetails: React.FC = () => {
  const styles = useStyles();

  return (
    <div css={styles.container}>
      <div css={[styles.column, styles.graphsColumn]}>Graphs here</div>

      <div css={[styles.column, styles.statsColumn]}>
        <MarketInfo />
      </div>
    </div>
  );
};

export default MarketDetails;
