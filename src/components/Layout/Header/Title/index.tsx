/** @jsxImportSource @emotion/react */
import { Typography } from '@mui/material';
import React from 'react';
import { useLocation, useRouteMatch } from 'react-router-dom';
import { useTranslation } from 'translation';
import { VTokenId } from 'types';
import { getToken } from 'utilities';

import Path from 'constants/path';
import useCopyToClipboard from 'hooks/useCopyToClipboard';

import EllipseAddress from '../../../EllipseAddress';
import { Icon } from '../../../Icon';
import { menuItems } from '../../constants';
import BackButton from './BackButton';
import { useStyles } from './styles';

const Title: React.FC = () => {
  const styles = useStyles();
  const { pathname } = useLocation();
  const voterDetailMatch = useRouteMatch<{ address: string }>(Path.VOTE_ADDRESS);
  const marketDetailsMatch = useRouteMatch<{ vTokenId: VTokenId }>(Path.MARKET_DETAILS);
  const voteLeaderboardMatch = useRouteMatch(Path.VOTE_LEADER_BOARD);
  const proposalDetailsMatch = useRouteMatch<{ id: string }>(Path.VOTE_PROPOSAL_DETAILS);
  const { t } = useTranslation();
  const copyToClipboard = useCopyToClipboard(t('interactive.copy.walletAddress'));

  // Handle special case of Market Details page
  if (marketDetailsMatch) {
    const { vTokenId } = marketDetailsMatch.params;
    const token = getToken(vTokenId);

    return (
      <BackButton>
        <Icon name={vTokenId} css={styles.backButtonTokenIcon} />
        <h3 css={styles.backButtonTokenSymbol}>{token.symbol}</h3>
      </BackButton>
    );
  }

  // Handle special case of Voter Details page
  if (voterDetailMatch) {
    const { address } = voterDetailMatch.params;
    return (
      <div css={styles.address}>
        <Typography variant="h3" color="textPrimary">
          <EllipseAddress address={address} />
        </Typography>

        <Icon name="copy" css={styles.icon} onClick={() => copyToClipboard(address)} />
      </div>
    );
  }

  // Handle special case of Proposal Details and Vote Leaderboard pages
  if (voteLeaderboardMatch || proposalDetailsMatch) {
    return (
      <BackButton>
        <h3>
          {voteLeaderboardMatch
            ? t('header.voteLeaderboardTitle')
            : t('header.proposalDetailsTitle')}
        </h3>
      </BackButton>
    );
  }

  const currentItem = menuItems.find(item => item.href === pathname);
  return currentItem ? <h3>{t(currentItem.i18nTitleKey)}</h3> : null;
};

export default Title;
