/** @jsxImportSource @emotion/react */
import { Typography } from '@mui/material';
import React, { useContext } from 'react';
import { useLocation, useRouteMatch } from 'react-router-dom';
import { useTranslation } from 'translation';
import { unsafelyGetToken } from 'utilities';

import addTokenToWallet from 'clients/web3/addTokenToWallet';
import Path from 'constants/path';
import { AuthContext } from 'context/AuthContext';
import useCopyToClipboard from 'hooks/useCopyToClipboard';

import { TertiaryButton } from '../../../Button';
import EllipseAddress from '../../../EllipseAddress';
import { Icon } from '../../../Icon';
import { TokenIcon } from '../../../TokenIcon';
import { menuItems } from '../../constants';
import BackButton from './BackButton';
import { useStyles } from './styles';

const Title: React.FC = () => {
  const styles = useStyles();
  const { pathname } = useLocation();
  const { account } = useContext(AuthContext);

  const voterDetailMatch = useRouteMatch<{ address: string }>(Path.GOVERNANCE_ADDRESS);
  const marketDetailsMatch = useRouteMatch<{ vTokenId: string }>(Path.MARKET_DETAILS);
  const voteLeaderboardMatch = useRouteMatch(Path.GOVERNANCE_LEADER_BOARD);
  const proposalDetailsMatch = useRouteMatch<{ id: string }>(Path.GOVERNANCE_PROPOSAL_DETAILS);
  const { t } = useTranslation();
  const copyToClipboard = useCopyToClipboard(t('interactive.copy.walletAddress'));

  // Handle special case of Market Details page
  if (marketDetailsMatch) {
    const { vTokenId } = marketDetailsMatch.params;
    const token = unsafelyGetToken(vTokenId);

    const onAddTokenToWallet = () => addTokenToWallet(vTokenId);

    return (
      <div css={styles.marketDetailsLeftColumn}>
        <BackButton>
          <TokenIcon token={token} css={styles.backButtonTokenIcon} />
          <h3 css={styles.backButtonTokenSymbol}>{token.symbol}</h3>
        </BackButton>

        {!!account && (
          <TertiaryButton css={styles.marketDetailsAddTokenButton} onClick={onAddTokenToWallet}>
            <Icon name="wallet" css={styles.marketDetailsWalletIcon} />
          </TertiaryButton>
        )}
      </div>
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
