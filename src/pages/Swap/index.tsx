/** @jsxImportSource @emotion/react */
import Paper from '@mui/material/Paper';
import React from 'react';

import { useStyles } from './styles';

const SwapUi: React.FC = () => {
  const styles = useStyles();

  return (
    <Paper css={styles.container}>
      <></>
    </Paper>
  );
};

const Swap: React.FC = () => <SwapUi />;

export default Swap;
