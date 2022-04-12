/** @jsxImportSource @emotion/react */
import React, { useMemo } from 'react';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import { Toolbar } from '../Toolbar';
import ConnectButton from './ConnectButton';
import { XvsCoinInfo, VaiCoinInfo } from '../CoinInfo';
import { useStyles } from './styles';
import { menuItems } from '../constants';

type HeaderProps = RouteComponentProps;

const Header = ({ location }: HeaderProps) => {
  const title = useMemo(
    () => menuItems.find(item => item.href === location.pathname)?.text,
    [location.pathname],
  );
  const styles = useStyles();
  return (
    <AppBar position="relative" css={styles.appBar}>
      <Toolbar css={styles.toolbar}>
        <h3>{title}</h3>

        <Box
          flexDirection="row"
          display="flex"
          flex={1}
          justifyContent="right"
          css={styles.rightItemContainer}
        >
          <XvsCoinInfo css={styles.rightItemPaper} className="coinInfo" />
          <VaiCoinInfo css={styles.rightItemPaper} className="coinInfo" />
          <ConnectButton css={styles.rightItemPaper} title="Connect wallet" />
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default withRouter(Header);
