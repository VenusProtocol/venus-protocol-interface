import React, { ReactNode } from 'react';
import Box from '@mui/material/Box';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { PageContainer } from './PageContainer';

/* sidebar width */
const drawerWidth = 180;

export const Layout = ({ children }: { children: ReactNode }) => {
  const offsetStyles = { width: `calc(100% - ${drawerWidth}px)`, ml: `${drawerWidth}px` };
  return (
    <Box sx={{ display: 'flex' }}>
      <Header offsetStyles={offsetStyles} pageTitle="Dashboard" />
      <Sidebar drawerWidth={drawerWidth} />
      <PageContainer offsetStyles={offsetStyles}>{children}</PageContainer>
    </Box>
  );
};
