/** @jsxImportSource @emotion/react */
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import { BigNumber } from 'bignumber.js';
import { Button, EllipseAddress, Icon, LabeledProgressBar, Tooltip } from 'components';
import React, { useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'translation';
import { Voter } from 'types';
import { convertWeiToTokens } from 'utilities';

import Path from 'constants/path';
import { XVS_TOKEN_ID } from 'constants/xvs';

import { useStyles } from './styles';

interface VoteSummaryProps {
  label: string;
  progressBarColor: string;
  votedValueWei?: BigNumber;
  votedTotalWei?: BigNumber;
  voters?: Voter['result'];
  className?: string;
  votingEnabled: boolean;
  openVoteModal: () => void;
  testId?: string;
}

const VoteSummary = ({
  openVoteModal,
  label,
  progressBarColor,
  votedTotalWei = new BigNumber(0),
  votedValueWei = new BigNumber(0),
  voters = [],
  className,
  votingEnabled,
  testId,
}: VoteSummaryProps) => {
  const styles = useStyles();
  const { t } = useTranslation();

  const getVoteWeight = useCallback(
    (voteWeightWei: BigNumber) =>
      convertWeiToTokens({
        valueWei: voteWeightWei,
        tokenId: XVS_TOKEN_ID,
        shortenLargeValue: true,
        addSymbol: false,
        returnInReadableFormat: true,
      }),
    [],
  );

  return (
    <Paper css={styles.root} className={className} data-testid={testId}>
      <div css={styles.topSection}>
        <div css={styles.labeledProgressBarContainer}>
          <LabeledProgressBar
            greyLeftText={label}
            whiteRightText={getVoteWeight(votedValueWei || new BigNumber(0))}
            value={votedValueWei.toNumber()}
            min={0}
            // If there are no votes set a fallback to zero the progressbar
            max={votedTotalWei.toNumber() || 100}
            step={1}
            ariaLabel={t('vote.summaryProgressBar', { voteType: label })}
            successColor={progressBarColor}
          />
        </div>

        <Button css={styles.button} onClick={openVoteModal} disabled={!votingEnabled}>
          {label}
        </Button>
      </div>

      <div css={styles.votesHeader}>
        <Typography>{t('voteSummary.addresses', { count: voters.length })}</Typography>
        <Typography>{t('voteSummary.votes')}</Typography>
      </div>

      <ul css={styles.votesWrapper}>
        {voters.map(({ address, voteWeightWei, reason }) => (
          <li key={address} css={styles.voteFrom}>
            <div css={styles.address}>
              <Link
                to={Path.VOTE_ADDRESS.replace(':address', address)}
                css={[styles.blueText, styles.addressText]}
              >
                <EllipseAddress address={address} />
              </Link>

              {reason && (
                <Tooltip title={reason}>
                  <Icon name="bubble" />
                </Tooltip>
              )}
            </div>

            <Typography color="text.primary">
              {convertWeiToTokens({
                valueWei: voteWeightWei,
                tokenId: XVS_TOKEN_ID,
                shortenLargeValue: true,
                addSymbol: false,
                returnInReadableFormat: true,
              })}
            </Typography>
          </li>
        ))}
      </ul>
    </Paper>
  );
};

export default VoteSummary;
