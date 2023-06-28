/** @jsxImportSource @emotion/react */
import { BigNumber } from 'bignumber.js';
import React, { useMemo } from 'react';
import { useTranslation } from 'translation';
import { convertWeiToTokens } from 'utilities';

import { TOKENS } from 'constants/tokens';
import { PALETTE } from 'theme/MuiThemeProvider/muiTheme';

import { LabeledProgressBar } from '../ProgressBar/LabeledProgressBar';
import { useStyles } from './styles';

interface ActiveVotingProgressProps {
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
    token: TOKENS.xvs,
    returnInReadableFormat: true,
  });
};

export const ActiveVotingProgress: React.FC<ActiveVotingProgressProps> = ({
  votedForWei,
  votedAgainstWei,
  abstainedWei,
  votedTotalWei,
}) => {
  const styles = useStyles();
  const { t } = useTranslation();

  const defaultProgressbarProps = {
    step: 1,
    min: 0,
    max: 100,
  };

  const activeProposalVotingData = useMemo(
    () => [
      {
        id: 'for',
        label: t('vote.for'),
        value: getValueString(votedForWei),
        progressBarProps: {
          ariaLabel: t('voteProposalUi.statusCard.ariaLabelFor'),
          value:
            votedForWei
              ?.dividedBy(votedTotalWei || 0)
              .times(100)
              .toNumber() || 0,
        },
      },
      {
        id: 'against',
        label: t('vote.against'),
        value: getValueString(votedAgainstWei),
        progressBarProps: {
          successColor: PALETTE.interactive.error50,
          ariaLabel: t('voteProposalUi.statusCard.ariaLabelAgainst'),
          value:
            votedAgainstWei
              ?.dividedBy(votedTotalWei || 0)
              .times(100)
              .toNumber() || 0,
        },
      },
      {
        id: 'abstain',
        label: t('vote.abstain'),
        value: getValueString(abstainedWei),
        progressBarProps: {
          successColor: PALETTE.text.secondary,
          ariaLabel: t('voteProposalUi.statusCard.ariaLabelAbstain'),
          value:
            abstainedWei
              ?.dividedBy(votedTotalWei || 0)
              .times(100)
              .toNumber() || 0,
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
          <div key={id} css={styles.bar}>
            <LabeledProgressBar
              greyLeftText={label}
              whiteRightText={value}
              {...defaultProgressbarProps}
              {...progressBarProps}
            />
          </div>
        );
      })}
    </div>
  );
};
