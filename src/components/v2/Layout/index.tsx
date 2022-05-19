/** @jsxImportSource @emotion/react */
import React from 'react';
import Box from '@mui/material/Box';
import Sidebar from './Sidebar';
import Header from './Header';
import { PageContainer } from './PageContainer';
import { useStyles } from './styles';

export interface ILayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<ILayoutProps> = ({ children }) => {
  const styles = useStyles();

  return (
    <div css={styles.layout}>
      <Sidebar />

      <Box display="flex" flexDirection="column" flex="1">
        <Header />
        <PageContainer>{children}</PageContainer>
      </Box>
    </div>
  );
};
