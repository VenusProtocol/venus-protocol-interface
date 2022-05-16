/** @jsxImportSource @emotion/react */
import React from 'react';
import Box from '@mui/material/Box';
import Sidebar from './Sidebar';
import Header from './Header';
import { PageContainer } from './PageContainer';
import { NoticeWarning } from '../Notice';
import { useStyles } from './styles';
import { useTranslation } from '../../../translation';

export interface ILayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<ILayoutProps> = ({ children }) => {
  const styles = useStyles();
  const { Trans } = useTranslation();
  return (
    <div css={styles.layout}>
      <Sidebar />
      <Box display="flex" flexDirection="column" flex="1">
        <NoticeWarning
          css={styles.banner}
          description={
            <Trans
              i18nKey="layout.bannerText"
              components={{
                Anchor: (
                  <a // eslint-disable-line jsx-a11y/anchor-has-content
                    css={styles.bannerLink}
                    href="https://blog.venus.io/venus-luna-incident-update-3-resuming-the-protocol-ff059a914405"
                    target="_blank"
                    rel="noreferrer"
                  />
                ),
              }}
            />
          }
        />
        <Header />
        <PageContainer>{children}</PageContainer>
      </Box>
    </div>
  );
};
