/** @jsxImportSource @emotion/react */
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'translation';
import { ProposalState, VoteSupport } from 'types';

import { Chip } from '../Chip';
import { Countdown } from '../Countdown';
import { useStyles } from './styles';

interface ProposalCardProps {
  className?: string;
  linkTo: string;
  proposalNumber: number;
  title: string;
  userVoteStatus?: VoteSupport;
  headerRightItem?: React.ReactElement;
  headerLeftItem?: React.ReactElement;
  contentRightItem: React.ReactElement;
  proposalState: ProposalState;
  endDate?: Date;
  cancelDate?: Date;
  queuedDate?: Date;
  executedDate?: Date;
}

export const ProposalCard: React.FC<ProposalCardProps> = ({
  className,
  linkTo,
  proposalNumber,
  title,
  headerRightItem,
  headerLeftItem,
  contentRightItem,
  proposalState,
  endDate,
  cancelDate,
  queuedDate,
  executedDate,
  ...containerProps
}) => {
  const styles = useStyles();
  const { Trans } = useTranslation();

  const footerDom = useMemo(() => {
    // Translation key: do not remove this comment
    // t('proposalCard.activeUntilDate')
    let i18nKey = 'proposalCard.activeUntilDate';
    let date = endDate;

    if (proposalState === 'Canceled') {
      // Translation key: do not remove this comment
      // t('proposalCard.canceled')
      i18nKey = 'proposalCard.canceled';
      date = cancelDate;
    } else if (proposalState === 'Defeated') {
      // Translation key: do not remove this comment
      // t('proposalCard.defeated')
      i18nKey = 'proposalCard.defeated';
    } else if (proposalState === 'Succeeded') {
      // Translation key: do not remove this comment
      // t('proposalCard.succeeded')
      i18nKey = 'proposalCard.succeeded';
    } else if (proposalState === 'Queued') {
      // Translation key: do not remove this comment
      // t('proposalCard.queued')
      i18nKey = 'proposalCard.queued';
      date = queuedDate;
    } else if (proposalState === 'Executed') {
      // Translation key: do not remove this comment
      // t('proposalCard.executed')
      i18nKey = 'proposalCard.executed';
      date = executedDate;
    } else if (proposalState === 'Expired') {
      // Translation key: do not remove this comment
      // t('proposalCard.expired')
      i18nKey = 'proposalCard.expired';
    }

    return (
      <div css={styles.timestamp}>
        {proposalState !== 'Pending' && endDate && (
          <Typography variant="small2">
            <Trans
              i18nKey={i18nKey}
              components={{
                Date: <Typography variant="small2" color="textPrimary" />,
              }}
              values={{ date }}
            />
          </Typography>
        )}

        {proposalState === 'Active' && endDate && <Countdown date={endDate} />}
      </div>
    );
  }, [proposalState, endDate, cancelDate]);

  return (
    <Paper
      className={className}
      css={styles.root}
      component={({ children, ...props }) => (
        <div {...props}>
          <Link to={linkTo}>{children}</Link>
        </div>
      )}
      {...containerProps}
    >
      <Grid container>
        <Grid css={[styles.gridItem, styles.gridItemLeft]} item xs={12} sm={8}>
          <div css={styles.cardHeader}>
            <div>
              <Chip text={`#${proposalNumber}`} />
              {headerLeftItem}
            </div>

            {headerRightItem}
          </div>

          <Typography variant="h4" css={styles.cardTitle} color="textPrimary">
            {title}
          </Typography>

          {footerDom}
        </Grid>
        <Grid css={[styles.gridItem, styles.gridItemRight]} item xs={12} sm={4}>
          {contentRightItem}
        </Grid>
      </Grid>
    </Paper>
  );
};
