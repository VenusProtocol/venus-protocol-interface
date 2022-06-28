/** @jsxImportSource @emotion/react */
import React from 'react';
import { Typography } from '@mui/material';
import { useRouteMatch, useLocation, Link } from 'react-router-dom';
import Path from 'constants/path';
import { getToken } from 'utilities';
import useCopyToClipboard from 'hooks/useCopyToClipboard';
import { VTokenId } from 'types';
import { useTranslation } from 'translation';
import EllipseText from '../../../EllipseText';
import { Icon } from '../../../Icon';
import { menuItems } from '../../constants';
import { useStyles } from './styles';

const Title: React.FC = () => {
  const styles = useStyles();
  const { pathname } = useLocation();
  const voterDetailMatch = useRouteMatch<{ address: string }>(Path.VOTE_ADDRESS);
  const marketDetailsMatch = useRouteMatch<{ vTokenId: VTokenId }>(Path.MARKET_DETAILS);
  const { t } = useTranslation();

  // Handle special case of Market Details page
  if (marketDetailsMatch) {
    const { vTokenId } = marketDetailsMatch.params;
    const token = getToken(vTokenId);

    return (
      <Link to={Path.MARKET} css={styles.backButton}>
        <Icon name="chevronLeft" css={styles.backButtonChevronIcon} />
        <Icon name={vTokenId} css={styles.backButtonTokenIcon} />
        <h3 css={styles.backButtonTokenSymbol}>{token.symbol}</h3>
      </Link>
    );
  }

  const copyToClipboard = useCopyToClipboard(t('interactive.copy.walletAddress'));

  if (voterDetailMatch) {
    const { address } = voterDetailMatch.params;
    return (
      <EllipseText css={styles.address} text={address} minChars={6}>
        <Typography variant="h3" color="textPrimary" className="ellipse-text">
          {address}
        </Typography>
        <Icon name="copy" css={styles.icon} onClick={() => copyToClipboard(address)} />
      </EllipseText>
    );
  }

  const currentItem = menuItems.find(item => item.href === pathname);
  const currentItemKey = currentItem?.i18nTitleKey || currentItem?.i18nKey;

  if (!currentItemKey) {
    return null;
  }

  return <h3>{t(currentItemKey)}</h3>;
};

export default Title;
