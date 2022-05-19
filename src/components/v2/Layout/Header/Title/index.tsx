/** @jsxImportSource @emotion/react */
import React from 'react';
import { useLocation, Link } from 'react-router-dom';

import Path from 'constants/path';
import { getToken } from 'utilities';
import { VTokenId } from 'types';
import { useTranslation } from 'translation';
import { Icon } from '../../../Icon';
import isOnMarketDetailsPage from './isOnMarketDetailsPage';
import { menuItems } from '../../constants';
import { useStyles } from './styles';

const Title: React.FC = () => {
  const styles = useStyles();
  const { pathname } = useLocation();
  const { t } = useTranslation();

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
};

export default Title;
