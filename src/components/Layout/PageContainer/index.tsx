/** @jsxImportSource @emotion/react */
import Box from '@mui/material/Box';
import React, { ReactNode } from 'react';

import Footer from '../Footer';
import { useStyles } from './styles';

interface PageContainerProps {
  children: ReactNode;
}

export const PageContainer = ({ children }: PageContainerProps) => {
  const styles = useStyles();
  return (
    <>
      <Box component="main" css={styles.main}>
        {children}
      </Box>
      <Box component="footer" css={styles.footer}>
        <Footer />
      </Box>
    </>
  );
};
