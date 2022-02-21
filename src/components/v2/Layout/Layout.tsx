import React, { ReactNode } from 'react';
import Box from '@mui/material/Box';
import { Sidebar } from './Sidebar/Sidebar';
import { Header } from './Header/Header';
import { PageContainer } from './PageContainer/PageContainer';
import styles from './Layout.module.scss';

interface IProps {
  children: ReactNode;
  pageTitle: string;
}

export const Layout = ({ children, pageTitle }: IProps) => (
  <Box className={styles.root}>
    <Header pageTitle={pageTitle} />
    <Sidebar />
    <PageContainer>{children}</PageContainer>
  </Box>
);
