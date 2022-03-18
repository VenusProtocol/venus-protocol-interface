import React from 'react';
import Box from '@mui/material/Box';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { PageContainer } from './PageContainer';

export interface ILayoutProps {
  currentBlockNumber: number;
}

export const Layout: React.FC<ILayoutProps> = ({ children, currentBlockNumber }) => (
  <Box display="flex">
    <Header pageTitle="Dashboard" />
    <Sidebar />
    <PageContainer currentBlockNumber={currentBlockNumber}>{children}</PageContainer>
  </Box>
);
