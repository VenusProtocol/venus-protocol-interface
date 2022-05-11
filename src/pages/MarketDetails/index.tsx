/** @jsxImportSource @emotion/react */
import React from 'react';

import { useStyles } from './styles';

const MarketDetails: React.FC = () => {
  const styles = useStyles();

  return (
    <div css={styles.container}>
      <div css={[styles.column, styles.content]}>Graphs here</div>

      <div css={[styles.column, styles.sideBar]}>Market detials</div>
    </div>
  );
};

export default MarketDetails;
