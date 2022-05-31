/** @jsxImportSource @emotion/react */
import React, { useMemo } from 'react';
import { BigNumber } from 'bignumber.js';
import Typography from '@mui/material/Typography';
import { useTranslation } from 'translation';
import { PALETTE } from 'theme/MuiThemeProvider/muiTheme';
import { TokenId } from 'types';
import { convertWeiToCoins } from 'utilities/common';
import { ProgressBar } from '../../ProgressBar';
import { useStyles } from '../styles';

interface IActiveVotingProgressProps {
  tokenId: TokenId;
  votedFor: BigNumber;
  votedAgainst: BigNumber;
  abstain: BigNumber;
}

export const ActiveVotingProgress: React.FC<IActiveVotingProgressProps> = ({
  tokenId,
  votedFor,
  votedAgainst,
  abstain,
}) => {
  const styles = useStyles();
  const { t } = useTranslation();
  const votedTotalWei = votedFor.plus(votedAgainst.plus(abstain));
  const votedTotalCoins = +convertWeiToCoins({
    valueWei: votedTotalWei,
    tokenId,
    returnInReadableFormat: false,
  }).toFormat();

  const defaultProgressbarProps = {
    step: 0.1,
    min: 0,
    max: votedTotalCoins,
  };

  const activeProposalVotingData = useMemo(
    () => [
      {
        id: 'for',
        label: t('voteProposalUi.statusCard.for'),
        value: convertWeiToCoins({
          valueWei: votedFor,
          tokenId,
          returnInReadableFormat: true,
        }),
        progressBarProps: {
          ariaLabel: 'votes for',
          value: +convertWeiToCoins({
            valueWei: votedFor,
            tokenId,
            returnInReadableFormat: false,
          }).toFormat(),
        },
      },
      {
        id: 'against',
        label: t('voteProposalUi.statusCard.against'),
        value: convertWeiToCoins({
          valueWei: votedAgainst,
          tokenId,
          returnInReadableFormat: true,
        }),
        progressBarProps: {
          progressColorOverride: PALETTE.interactive.error50,
          ariaLabel: 'votes against',
          value: +convertWeiToCoins({
            valueWei: votedAgainst,
            tokenId,
            returnInReadableFormat: false,
          }).toFormat(),
        },
      },
      {
        id: 'abstain',
        label: t('voteProposalUi.statusCard.abstain'),
        value: convertWeiToCoins({
          valueWei: abstain,
          tokenId,
          returnInReadableFormat: true,
        }),
        progressBarProps: {
          progressColorOverride: PALETTE.text.secondary,
          ariaLabel: 'votes abstain',
          value: +convertWeiToCoins({
            valueWei: abstain,
            tokenId,
            returnInReadableFormat: false,
          }).toFormat(),
        },
      },
    ],
    [votedFor, votedAgainst, abstain],
  );

  return (
    <>
      {activeProposalVotingData.map(({ id, label, value, progressBarProps }) => {
        if (!value) {
          return null;
        }
        return (
          <React.Fragment key={id}>
            <div css={styles.voteRow}>
              <Typography variant="small2" color="textPrimary">
                {label}
              </Typography>

              <Typography variant="small2" color="textPrimary">
                {value}
              </Typography>
            </div>
            <ProgressBar {...defaultProgressbarProps} {...progressBarProps} />
          </React.Fragment>
        );
      })}
    </>
  );
};
