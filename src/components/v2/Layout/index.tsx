/** @jsxImportSource @emotion/react */
import React from 'react';
import Typography from '@mui/material/Typography';
import { Icon } from '../Icon';
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
      <div css={styles.main}>
        <div css={styles.ustWarning}>
          <Typography component="p" variant="small1">
            <Icon name="attention" />
            Venus uses Wormhole UST. Many CEXs currently only recognize Wrapped UST. Please convert
            your UST as needed.
          </Typography>
        </div>
        <Header />
        <PageContainer>{children}</PageContainer>
      </div>
    </div>
  );
};
