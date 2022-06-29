/** @jsxImportSource @emotion/react */
import React, { useMemo } from 'react';
import { BigNumber } from 'bignumber.js';
import { LabeledProgressBar } from 'components';
import { XVS_TOKEN_ID } from 'constants/xvs';
import { useTranslation } from 'translation';
import { PALETTE } from 'theme/MuiThemeProvider/muiTheme';
import { convertWeiToTokens } from 'utilities';
import { useStyles } from '../styles';

interface IActiveVotingProgressProps {
  votedForWei?: BigNumber;
  votedAgainstWei?: BigNumber;
  abstainedWei?: BigNumber;
  votedTotalWei?: BigNumber;
}

const getValueString = (valueWei?: BigNumber) => {
  // if !valueWei the progress row will not be rendered
  if (!valueWei) return undefined;
  return convertWeiToTokens({
    valueWei,
    tokenId: XVS_TOKEN_ID,
    returnInReadableFormat: true,
  });
};

const getValueNumber = (valueWei?: BigNumber) => {
  if (!valueWei) return 0;
  return +convertWeiToTokens({
    valueWei,
    tokenId: XVS_TOKEN_ID,
    returnInReadableFormat: false,
  }).toFormat();
};

export const ActiveVotingProgress: React.FC<IActiveVotingProgressProps> = ({
  votedForWei,
  votedAgainstWei,
  abstainedWei,
  votedTotalWei,
}) => {
  const styles = useStyles();
  const { t } = useTranslation();

  const votedTotalTokens = getValueNumber(votedTotalWei);

  const defaultProgressbarProps = {
    step: 0.0001,
    min: 0,

    // || 1 is used for rendering an empty progressbar for case when votedTotalTokens is 0
    max: votedTotalTokens || 1,
  };

  const activeProposalVotingData = useMemo(
    () => [
      {
        id: 'for',
        label: t('vote.for'),
        value: getValueString(votedForWei),
        progressBarProps: {
          ariaLabel: t('voteProposalUi.statusCard.ariaLabelFor'),
          value: getValueNumber(votedForWei),
        },
      },
      {
        id: 'against',
        label: t('vote.against'),
        value: getValueString(votedAgainstWei),
        progressBarProps: {
          successColor: PALETTE.interactive.error50,
          ariaLabel: t('voteProposalUi.statusCard.ariaLabelAgainst'),
          value: getValueNumber(votedAgainstWei),
        },
      },
      {
        id: 'abstain',
        label: t('vote.abstain'),
        value: getValueString(abstainedWei),
        progressBarProps: {
          successColor: PALETTE.text.secondary,
          ariaLabel: t('voteProposalUi.statusCard.ariaLabelAbstain'),
          value: getValueNumber(abstainedWei),
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
            <LabeledProgressBar
              greyLeftText={label}
              whiteRightText={value}
              {...defaultProgressbarProps}
              {...progressBarProps}
            />
          </React.Fragment>
        );
      })}
    </div>
  );
};
