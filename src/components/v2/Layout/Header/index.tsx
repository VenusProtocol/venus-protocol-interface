/** @jsxImportSource @emotion/react */
import React, { useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';

import { useTranslation } from 'translation';
import { Toolbar } from '../Toolbar';
import ConnectButton from '../ConnectButton';
import { XvsCoinInfo, VaiCoinInfo } from '../CoinInfo';
import { menuItems } from '../constants';
import { useStyles } from './styles';

const Header = () => {
  const { pathname } = useLocation();
  const styles = useStyles();
  const { t } = useTranslation();

  const title = useMemo(() => {
    const currentItemKey = menuItems.find(item => item.href === pathname)?.i18nKey;
    if (!currentItemKey) {
      console.error(`missed key for translation: ${pathname}`);
      return null;
    }
    return t(currentItemKey);
  }, [pathname]);

  return (
    <AppBar position="relative" css={styles.appBar}>
      <Toolbar css={styles.toolbar}>
        {title && <h3>{title}</h3>}
        <Box
          flexDirection="row"
          display="flex"
          flex={1}
          justifyContent="right"
          css={styles.rightItemContainer}
        >
          <XvsCoinInfo css={styles.rightItemPaper} className="coinInfo" />
          <VaiCoinInfo css={styles.rightItemPaper} className="coinInfo" />
          <ConnectButton css={styles.rightItemPaper} title={t('header.connectButton.title')} />
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
