/** @jsxImportSource @emotion/react */
import React from 'react';
import Box from '@mui/material/Box';
import { useStyles } from './styles';

export const TextField: React.FC = () => {
  const styles = useStyles();

  return (
    <Box css={styles.container}>
      <Box css={styles.inputContainer}>
        <input css={styles.input} />
      </Box>
    </Box>
  );
};
