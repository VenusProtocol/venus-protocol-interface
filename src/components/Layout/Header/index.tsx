/** @jsxImportSource @emotion/react */
import AppBar from '@mui/material/AppBar';
import React, { Suspense, lazy } from 'react';

import ConnectButton from '../ConnectButton';
import { Toolbar } from '../Toolbar';
import Breadcrumbs from './Breadcrumbs';
import { useStyles } from './styles';

const ClaimRewardButton = lazy(() => import('../ClaimRewardButton'));

const Header: React.FC = () => {
  const styles = useStyles();

  return (
    <AppBar position="relative" css={styles.appBar}>
      <Toolbar css={styles.toolbar}>
        <Breadcrumbs />

        <div css={styles.ctaContainer}>
          <Suspense>
            <ClaimRewardButton css={styles.claimXvsButton} />
          </Suspense>

          <ConnectButton />
        </div>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
