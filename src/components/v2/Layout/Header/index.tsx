/** @jsxImportSource @emotion/react */
import React, { useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';

import { useTranslation } from 'translation';
import { useIsMdDown } from 'hooks/responsive';
import { Toolbar } from '../Toolbar';
import ClaimXvsRewardButton from '../ClaimXvsRewardButton';
import ConnectButton from '../ConnectButton';
import { menuItems } from '../constants';
import { useStyles } from './styles';

const Header = () => {
  const { pathname } = useLocation();
  const styles = useStyles();
  const { t } = useTranslation();

  const isOnMobile = useIsMdDown();

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

        {!isOnMobile && (
          <Box flexDirection="row" display="flex" flex={1} justifyContent="right">
            <ClaimXvsRewardButton />
            <ConnectButton css={styles.rightItemPaper} />
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Header;
