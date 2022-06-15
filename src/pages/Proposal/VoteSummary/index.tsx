/** @jsxImportSource @emotion/react */
import React, { useCallback } from 'react';
import { BigNumber } from 'bignumber.js';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';

import { formatCoinsToReadableValue } from 'utilities/common';
import { generateBscScanUrl } from 'utilities';
import { useTranslation } from 'translation';
import { XVS_TOKEN_ID } from 'constants/xvs';
import {
  Button,
  Icon,
  LabeledInlineContent,
  EllipseText,
  Tooltip,
  LabeledProgressBar,
} from 'components';

import { useStyles } from './styles';

type VoteFrom = {
  address: string;
  voteWeightWei: BigNumber;
  comment?: string;
};

interface IVoteSummaryProps {
  onClick: () => void;
  label: string;
  progressBarColor: string;
  votedValueWei?: BigNumber;
  votedTotalWei?: BigNumber;
  votesFrom?: VoteFrom[];
  className?: string;
  isDisabled?: boolean;
}

export const VoteSummary = ({
  onClick,
  label,
  progressBarColor,
  votedTotalWei = new BigNumber(0),
  votedValueWei = new BigNumber(0),
  votesFrom = [],
  className,
  isDisabled,
}: IVoteSummaryProps) => {
  const styles = useStyles();
  const { t } = useTranslation();

  const getVoteWeight = useCallback(
    (voteWeightWei: BigNumber) =>
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
      <LabeledProgressBar
        greyLeftText={label}
        whiteRightText={getVoteWeight(votedValueWei || new BigNumber(0))}
        value={votedValueWei.toNumber()}
        min={0}
        max={votedTotalWei.toNumber()}
        step={1}
        ariaLabel={t('vote.summaryProgressBar', { voteType: label })}
        successColor={progressBarColor}
      />
      <Button css={styles.button} onClick={onClick} disabled={isDisabled}>
        {label}
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
            <Typography color="text.primary">
              {formatCoinsToReadableValue({
                value: voteWeightWei,
                tokenId: XVS_TOKEN_ID,
                shortenLargeValue: true,
                addSymbol: false,
              })}
            </Typography>
          </li>
        ))}
      </ul>
    </Paper>
  );
};
