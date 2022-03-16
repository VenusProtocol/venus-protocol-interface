/** @jsxImportSource @emotion/react */
import React, { ReactNode } from 'react';
import Toolbar from '@mui/material/Toolbar';
import Box from '@mui/material/Box';
import { Footer, IFooterProps } from 'components/v2/Layout/Footer';
import { useStyles } from './PageContainerStyles';

interface IPageContainerProps {
  children: ReactNode;
  currentBlockNumber: IFooterProps['currentBlockNumber'];
}

export const PageContainer = ({ children, currentBlockNumber }: IPageContainerProps) => {
  const styles = useStyles();
  return (
    <Box component="main" css={styles.main}>
      <Toolbar />

      {children}

      <Box component="footer" css={styles.footer}>
        <Footer currentBlockNumber={currentBlockNumber} />
      </Box>
    </Box>
  );
};
