import React, { ReactNode } from 'react';
import Toolbar from '@mui/material/Toolbar';
import Box from '@mui/material/Box';
import { layoutOffset } from 'theme/MuiThemeProvider/muiTheme';
import Footer from 'containers/Layout/Footer';

interface IPageContainerProps {
  children: ReactNode;
}

export const PageContainer = ({ children }: IPageContainerProps) => (
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

    <Box component="footer" sx={{ position: 'fixed', bottom: 0, left: 0, ...layoutOffset }}>
      {/* TODO: footer v2 */}
      <Footer />
    </Box>
  </Box>
);
