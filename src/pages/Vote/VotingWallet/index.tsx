/** @jsxImportSource @emotion/react */
import React from 'react';
import { Typography } from '@mui/material';
import { useTranslation } from 'translation';
import { useStyles } from './styles';

export const VoteUi: React.FC = () => {
  const { t } = useTranslation();
  const styles = useStyles();
  const readableXvsLocked = convertWeiToCoins({
    valueWei: xvsLockedWei,
    tokenId: 'xvs',
    returnInReadableFormat: true,
    addSymbol: false,
    minimizeDecimals: true,
  });
  return (
    <div css={styles.root}>
      <Typography variant="h4">{t('vote.votingWallet')}</Typography>
      <Paper css={styles.votingWalletPaper}>
        <div css={styles.votingWeightContainer}>
          <Typography variant="body2" css={styles.subtitle}>
            {t('vote.votingWeight')}
          </Typography>
          <Typography variant="h3">{format(votingWeight, 8)}</Typography>
        </div>
        <Delimiter />
        <div css={styles.totalLockedContainer}>
          <Typography variant="body2" css={styles.subtitle}>
            {t('vote.totalLocked')}
          </Typography>
          <div css={styles.totalLockedValue}>
            <Icon name="xvs" css={styles.tokenIcon} />
            <Typography variant="h3">{readableXvsLocked}</Typography>
          </div>
        </div>
        <LinkButton fullWidth to={PATHS.VAULT}>
          {t('vote.depositXvs')}
        </LinkButton>
      </Paper>
      <Paper css={[styles.votingWalletPaper, styles.voteSection]}>
        <Typography variant="body2" color="textPrimary" css={styles.toVote}>
          {t('vote.toVoteYouShould')}
        </Typography>
        <Typography variant="small2" color="textPrimary" css={styles.depositTokens}>
          <Trans
            i18nKey="vote.depositYourTokens"
            components={{
              Link: <Link to={PATHS.VAULT} css={styles.clickableText} />,
            }}
          />
        </Typography>
        <Typography variant="small2" color="textPrimary">
          <Trans
            i18nKey="vote.delegateYourVoting"
            components={{
              Anchor: <span css={styles.clickableText} role="button" aria-pressed="false" />,
            }}
          />
        </Typography>
      </Paper>
    </div>
  );
};

const Vote: React.FC = () => <VoteUi />;

export default Vote;
