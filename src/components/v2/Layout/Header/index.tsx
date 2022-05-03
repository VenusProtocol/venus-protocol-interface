/** @jsxImportSource @emotion/react */
import React, { useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import AppBar from '@mui/material/AppBar';

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
    const currentItem = menuItems.find(item => item.href === pathname);
    const currentItemKey = currentItem?.i18nTitleKey || currentItem?.i18nKey;
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
          <div css={styles.ctaContainer}>
            <ClaimXvsRewardButton css={styles.claimXvsButton} />
            <ConnectButton />
          </div>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Header;
