import React, { ReactNode } from 'react';
import Box from '@mui/material/Box';
import { Sidebar } from './Sidebar/Sidebar';
import { Header } from './Header/Header';
import { PageContainer } from './PageContainer/PageContainer';

export const Layout = ({ children }: { children: ReactNode }) => (
  <Box display="flex">
    <Header pageTitle="Dashboard" />
    <Sidebar />
    <PageContainer>{children}</PageContainer>
  </Box>
);
