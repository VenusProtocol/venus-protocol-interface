import React, { ReactNode } from 'react';
import Box from '@mui/material/Box';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { PageContainer } from './PageContainer';

export const Layout = ({ children }: { children: ReactNode }) => (
  <Box sx={{ display: 'flex' }}>
    <Header pageTitle="Dashboard" />
    <Sidebar />
    <PageContainer>{children}</PageContainer>
  </Box>
);
