import React, { ReactNode } from 'react';
import Toolbar from '@mui/material/Toolbar';
import Box from '@mui/material/Box';
import Footer from '../../../containers/Layout/Footer';

interface IPageContainerProps {
  children: ReactNode;
  offsetStyles: Record<string, string>;
}

export const PageContainer = ({ children, offsetStyles }: IPageContainerProps) => (
  <Box
    component="main"
    sx={{
      flexGrow: 1,
      p: 3,
      pb: 6,
      minHeight: '100vh',
    }}
  >
    <Toolbar />

    {children}

    <Box component="footer" sx={{ position: 'fixed', bottom: 0, left: 0, ...offsetStyles }}>
      <Footer />
    </Box>
  </Box>
);
