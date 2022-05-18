/** @jsxImportSource @emotion/react */
import React, { useMemo } from 'react';
import { useLocation, Link } from 'react-router-dom';
import AppBar from '@mui/material/AppBar';

import Path from 'constants/path';
import { getToken } from 'utilities';
import { VTokenId } from 'types';
import { useTranslation } from 'translation';
import { useIsMdDown } from 'hooks/responsive';
import { Toolbar } from '../Toolbar';
import ClaimXvsRewardButton from '../ClaimXvsRewardButton';
import ConnectButton from '../ConnectButton';
import { Icon } from '../../Icon';
import isOnMarketDetailsPage from './isOnMarketDetailsPage';
import { menuItems } from '../constants';
import { useStyles } from './styles';

const Header = () => {
  const { pathname } = useLocation();
  const styles = useStyles();
  const { t } = useTranslation();

  const isOnMobile = useIsMdDown();

  const title = useMemo(() => {
    // Handle special case of Market Details page
    if (isOnMarketDetailsPage(pathname)) {
      const vTokenId = pathname.substring(pathname.lastIndexOf('/') + 1) as VTokenId;
      const token = getToken(vTokenId);

      return (
        <Link to={Path.MARKET} css={styles.backButton}>
          <Icon name="chevronLeft" css={styles.backButtonChevronIcon} />
          <Icon name={vTokenId} css={styles.backButtonTokenIcon} />
          <h3 css={styles.backButtonTokenSymbol}>{token.symbol}</h3>
        </Link>
      );
    }

    const currentItem = menuItems.find(item => item.href === pathname);
    const currentItemKey = currentItem?.i18nTitleKey || currentItem?.i18nKey;

    if (!currentItemKey) {
      console.error(`Missing translation for key: ${pathname}`);
      return null;
    }

    return <h3>{t(currentItemKey)}</h3>;
  }, [pathname]);

  return (
    <AppBar position="relative" css={styles.appBar}>
      <Toolbar css={styles.toolbar}>
        {title}

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
