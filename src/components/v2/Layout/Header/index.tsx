/** @jsxImportSource @emotion/react */
import React, { useMemo } from 'react';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import Typography from '@mui/material/Typography';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import { Toolbar } from '../Toolbar';
import ConnectButton from './ConnectButton';
import { XvsCoinInfo, VaiCoinInfo } from '../CoinInfo';
import { useStyles } from './styles';
import { menuItems } from '../constants';

type HeaderProps = RouteComponentProps;

export const Header = ({ location }: HeaderProps) => {
  const title = useMemo(
    () => menuItems.find(item => item.href === location.pathname)?.text,
    [location.pathname],
  );
  const styles = useStyles();
  return (
    <AppBar position="relative" css={styles.appBar}>
      <Toolbar css={styles.toolbar}>
        <Typography variant="h2" noWrap component="div">
          {title}
        </Typography>
        <Box flexDirection="row" display="flex" flex={1} justifyContent="right">
          <XvsCoinInfo css={styles.rightItemPaper} className="coinInfo" />
          <VaiCoinInfo css={styles.rightItemPaper} className="coinInfo" />
          <ConnectButton css={styles.rightItemPaper} title="Connect wallet" />
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default withRouter(Header);
