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
  votedForWei?: BigNumber;
  votedAgainstWei?: BigNumber;
  abstainedWei?: BigNumber;
  votedTotalWei?: BigNumber;
}

const getValueString = (tokenId: TokenId, valueWei?: BigNumber) => {
  // if !valueWei the progress row will not be rendered
  if (!valueWei) return undefined;
  return convertWeiToCoins({
    valueWei,
    tokenId,
    returnInReadableFormat: true,
  });
};

const getValueNumber = (tokenId: TokenId, valueWei?: BigNumber) => {
  if (!valueWei) return 0;
  return +convertWeiToCoins({
    valueWei,
    tokenId,
    returnInReadableFormat: false,
  }).toFormat();
};

export const ActiveVotingProgress: React.FC<IActiveVotingProgressProps> = ({
  tokenId,
  votedForWei,
  votedAgainstWei,
  abstainedWei,
  votedTotalWei,
}) => {
  const styles = useStyles();
  const { t } = useTranslation();

  const votedTotalCoins = getValueNumber(tokenId, votedTotalWei);

  const defaultProgressbarProps = {
    step: 0.0001,
    min: 0,

    // || 1 is used for rendering an empty progressbar for case when votedTotalCoins is 0
    max: votedTotalCoins || 1,
  };

  const activeProposalVotingData = useMemo(
    () => [
      {
        id: 'for',
        label: t('voteProposalUi.statusCard.for'),
        value: getValueString(tokenId, votedForWei),
        progressBarProps: {
          ariaLabel: t('voteProposalUi.statusCard.ariaLabelFor'),
          value: getValueNumber(tokenId, votedForWei),
        },
      },
      {
        id: 'against',
        label: t('voteProposalUi.statusCard.against'),
        value: getValueString(tokenId, votedAgainstWei),
        progressBarProps: {
          successColor: PALETTE.interactive.error50,
          ariaLabel: t('voteProposalUi.statusCard.ariaLabelAgainst'),
          value: getValueNumber(tokenId, votedAgainstWei),
        },
      },
      {
        id: 'abstain',
        label: t('voteProposalUi.statusCard.abstain'),
        value: getValueString(tokenId, abstainedWei),
        progressBarProps: {
          successColor: PALETTE.text.secondary,
          ariaLabel: t('voteProposalUi.statusCard.ariaLabelAbstain'),
          value: getValueNumber(tokenId, abstainedWei),
        },
      },
    ],
    [votedForWei, votedAgainstWei, abstainedWei],
  );

  return (
    <div css={styles.votesWrapper}>
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
    </div>
  );
};
