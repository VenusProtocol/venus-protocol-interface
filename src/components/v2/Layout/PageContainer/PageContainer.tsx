import React, { ReactNode } from 'react';
import Toolbar from '@mui/material/Toolbar';
import Box from '@mui/material/Box';
import { Footer, IFooterProps } from 'components/v2/Layout/Footer';
import { styles } from './PageContainerStyles';

interface IPageContainerProps {
  children: ReactNode;
  currentBlockNumber: IFooterProps['currentBlockNumber'];
}

export const PageContainer = ({ children, currentBlockNumber }: IPageContainerProps) => (
  <Box component="main" sx={styles.main}>
    <Toolbar />

    {children}

    <Box component="footer" sx={styles.footer}>
      <Footer currentBlockNumber={currentBlockNumber} />
    </Box>
  </Box>
);
