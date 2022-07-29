/** @jsxImportSource @emotion/react */
import Box from '@mui/material/Box';
import React from 'react';

import Header from './Header';
import { PageContainer } from './PageContainer';
import Sidebar from './Sidebar';
import { useStyles } from './styles';

export const Layout: React.FC = ({ children }) => {
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
