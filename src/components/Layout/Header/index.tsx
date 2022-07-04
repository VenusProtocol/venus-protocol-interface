/** @jsxImportSource @emotion/react */
import React from 'react';
import AppBar from '@mui/material/AppBar';

import { Toolbar } from '../Toolbar';
import ClaimXvsRewardButton from '../ClaimXvsRewardButton';
import ConnectButton from '../ConnectButton';
import Title from './Title';
import { useStyles } from './styles';

const Header: React.FC = () => {
  const styles = useStyles();

  return (
    <AppBar position="relative" css={styles.appBar}>
      <Toolbar css={styles.toolbar}>
        <Title />

        <div css={styles.ctaContainer}>
          <ClaimXvsRewardButton css={styles.claimXvsButton} />
          <ConnectButton />
        </div>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
