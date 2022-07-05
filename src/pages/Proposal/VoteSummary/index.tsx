/** @jsxImportSource @emotion/react */
import React, { useCallback } from 'react';
import { BigNumber } from 'bignumber.js';
import { Link } from 'react-router-dom';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Path from 'constants/path';
import { convertWeiToTokens } from 'utilities';
import { useTranslation } from 'translation';
import { XVS_TOKEN_ID } from 'constants/xvs';
import {
  Button,
  Icon,
  LabeledInlineContent,
  EllipseAddress,
  Tooltip,
  LabeledProgressBar,
} from 'components';
import { IVoter } from 'types';
import { useStyles } from './styles';

interface IVoteSummaryProps {
  label: string;
  progressBarColor: string;
  votedValueWei?: BigNumber;
  votedTotalWei?: BigNumber;
  voters?: IVoter['result'];
  className?: string;
  votingEnabled: boolean;
  openVoteModal: () => void;
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
}: IVoteSummaryProps) => {
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
    <Paper css={styles.root} className={className}>
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
      <Button css={styles.button} onClick={openVoteModal} disabled={!votingEnabled}>
        {label}
      </Button>

      <LabeledInlineContent label={t('voteSummary.addresses', { length: voters.length })}>
        <Typography>{t('voteSummary.votes')}</Typography>
      </LabeledInlineContent>

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
