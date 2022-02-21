import React, { ReactNode } from 'react';
import Toolbar from '@mui/material/Toolbar';
import Box from '@mui/material/Box';
import Footer from 'containers/Layout/Footer';
import { styles } from './PageContainerStyles';

interface IPageContainerProps {
  children: ReactNode;
}

export const PageContainer = ({ children }: IPageContainerProps) => (
  <Box component="main" sx={styles.main}>
    <Toolbar />

    {children}

    <Box component="footer" sx={styles.footer}>
      {/* TODO: footer v2 */}
      <Footer />
    </Box>
  </Box>
);
