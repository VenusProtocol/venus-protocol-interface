/** @jsxImportSource @emotion/react */
import React from 'react';
import Typography from '@mui/material/Typography';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import { Toolbar } from '../Toolbar';
import ConnectButton from '../../../Basic/ConnectButton';
import { XvsCoinInfo, VaiCoinInfo } from './CoinInfoContainers';
import { useStyles } from './styles';

interface IHeaderProps {
  pageTitle: string;
}

export const Header = ({ pageTitle }: IHeaderProps) => {
  const styles = useStyles();
  return (
    <AppBar position="fixed" css={styles.appBar}>
      <Toolbar css={styles.toolbar}>
        <Typography variant="h2" noWrap component="div">
          {pageTitle}
        </Typography>
        <Box flexDirection="row" display="flex" flex={1} justifyContent="right">
          <XvsCoinInfo css={styles.rightItemPaper} />
          <VaiCoinInfo css={styles.rightItemPaper} />
          <ConnectButton />
        </Box>
      </Toolbar>
    </AppBar>
  );
};
