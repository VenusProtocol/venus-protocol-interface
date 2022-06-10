/** @jsxImportSource @emotion/react */
import React, { useMemo } from 'react';
import { BigNumber } from 'bignumber.js';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';

import { formatCoinsToReadableValue } from 'utilities/common';
import { generateBscScanUrl } from 'utilities';
import { useTranslation } from 'translation';
import { XVS_TOKEN_ID } from 'constants/xvs';
import { ActiveVotingProgress } from '../../../components/v2/GovernanceProposal/ActiveVotingProgress';
import { Button } from '../../../components/v2/Button';
import { Icon } from '../../../components/v2/Icon';
import { LabeledInlineContent } from '../../../components/v2/LabeledInlineContent';
import EllipseText from '../../../components/v2/EllipseText';
import { Tooltip } from '../../../components/v2/Tooltip';

import { useStyles } from './styles';

type VoteFrom = {
  address: string;
  voteWeightWei: BigNumber;
  comment?: string;
};

interface IVoteSummaryProps {
  className?: string;
  votesFrom?: VoteFrom[];
  votedForWei?: BigNumber;
  votedAgainstWei?: BigNumber;
  abstainedWei?: BigNumber;
  votedTotalWei?: BigNumber;
  onClick: () => void;
  isDisabled?: boolean;
}

export const VoteSummary = ({
  className,
  votesFrom = [],
  votedForWei,
  votedAgainstWei,
  abstainedWei,
  votedTotalWei,
  onClick,
  isDisabled,
}: IVoteSummaryProps) => {
  const styles = useStyles();
  const { t } = useTranslation();

  const getVoteWeight = (voteWeightWei: BigNumber) =>
    useMemo(
      () =>
        formatCoinsToReadableValue({
          value: voteWeightWei,
          tokenId: XVS_TOKEN_ID,
          shortenLargeValue: true,
          addSymbol: false,
        }),
      [],
    );

  return (
    <Paper css={styles.root} className={className}>
      <ActiveVotingProgress
        votedForWei={votedForWei}
        votedAgainstWei={votedAgainstWei}
        abstainedWei={abstainedWei}
        votedTotalWei={votedTotalWei}
      />
      <Button css={styles.button} onClick={onClick} disabled={isDisabled}>
        {votedForWei && t('vote.for')}
        {votedAgainstWei && t('vote.against')}
        {abstainedWei && t('vote.abstain')}
      </Button>

      <LabeledInlineContent label={t('voteSummary.addresses', { length: votesFrom.length })}>
        <Typography>{t('voteSummary.votes')}</Typography>
      </LabeledInlineContent>

      <ul css={styles.votesWrapper}>
        {votesFrom.map(({ address, voteWeightWei, comment }) => (
          <li key={address} css={styles.voteFrom}>
            <EllipseText css={styles.address} text={address}>
              <Typography
                className="ellipse-text"
                href={generateBscScanUrl('xvs')}
                target="_blank"
                rel="noreferrer"
                variant="body1"
                component="a"
                css={[styles.blueText, styles.addressText]}
              />
              {comment && (
                <Tooltip title={comment}>
                  <Icon name="bubble" />
                </Tooltip>
              )}
            </EllipseText>
            <Typography color="text.primary">{getVoteWeight(voteWeightWei)}</Typography>
          </li>
        ))}
      </ul>
    </Paper>
  );
};
