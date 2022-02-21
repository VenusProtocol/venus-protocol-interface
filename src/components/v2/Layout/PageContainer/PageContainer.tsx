import React, { ReactNode } from 'react';
import Toolbar from '@mui/material/Toolbar';
import Box from '@mui/material/Box';
import Footer from '../../../../containers/Layout/Footer';
import styles from './PageContainer.module.scss';

interface IPageContainerProps {
  children: ReactNode;
}

export const PageContainer = ({ children }: IPageContainerProps) => (
  <Box component="main" className={styles.main}>
    <Toolbar />

    {children}

    <Box component="footer" className={styles.footer}>
      {/* TODO: add v2 footer */}
      <Footer />
    </Box>
  </Box>
);
