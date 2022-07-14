/** @jsxImportSource @emotion/react */
import Box from '@mui/material/Box';
import React from 'react';
import { useTranslation } from 'translation';

import { Banner } from './Banner';
import Header from './Header';
import { PageContainer } from './PageContainer';
import Sidebar from './Sidebar';
import { useStyles } from './styles';

export const Layout: React.FC = ({ children }) => {
  const styles = useStyles();
  const { t } = useTranslation();
  return (
    <div css={styles.layout}>
      <Sidebar />

      <Box display="flex" flexDirection="column" flex="1">
        <Banner showBanner bannerText={t('layout.banner')} />
        <Header />
        <PageContainer>{children}</PageContainer>
      </Box>
    </div>
  );
};
