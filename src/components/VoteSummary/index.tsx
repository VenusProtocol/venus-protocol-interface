/** @jsxImportSource @emotion/react */
import React from 'react';
import { BigNumber } from 'bignumber.js';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';

import { formatCoinsToReadableValue } from 'utilities/common';
import { generateBscScanUrl } from 'utilities';
import { useTranslation } from 'translation';
import { ActiveVotingProgress } from '../GovernanceProposal/ActiveVotingProgress';
import { Button } from '../Button';
import { Icon } from '../Icon';
import { LabeledInlineContent } from '../LabeledInlineContent';
import EllipseText from '../EllipseText';
import { Tooltip } from '../Tooltip';

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

  return (
    <Paper css={styles.root} className={className}>
      <ActiveVotingProgress
        votedForWei={votedForWei}
        votedAgainstWei={votedAgainstWei}
        abstainedWei={abstainedWei}
        votedTotalWei={votedTotalWei}
      />
      <Button css={styles.button} onClick={onClick} disabled={isDisabled}>
        {votedForWei && t('voteSummary.for')}
        {votedAgainstWei && t('voteSummary.against')}
        {abstainedWei && t('voteSummary.abstain')}
      </Button>

      <LabeledInlineContent label={t('voteSummary.addresses', { length: votesFrom.length })}>
        <Typography>{t('voteSummary.votes')}</Typography>
      </LabeledInlineContent>

      {votesFrom.length > 0 && (
        <>
          {votesFrom.map(({ address, voteWeightWei, comment }) => (
            <div key={address} css={styles.voteFrom}>
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
              <Typography color="text.primary">
                {formatCoinsToReadableValue({
                  value: voteWeightWei,
                  tokenId: 'xvs',
                  shortenLargeValue: true,
                  addSymbol: false,
                })}
              </Typography>
            </div>
          ))}
        </>
      )}
    </Paper>
  );
};
