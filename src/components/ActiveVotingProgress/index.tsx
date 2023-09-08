/** @jsxImportSource @emotion/react */
import { BigNumber } from 'bignumber.js';
import React, { useMemo } from 'react';
import { useTranslation } from 'translation';
import { Token } from 'types';
import { convertWeiToTokens } from 'utilities';

import useGetToken from 'hooks/useGetToken';
import { PALETTE } from 'theme/MuiThemeProvider/muiTheme';

import { LabeledProgressBar } from '../ProgressBar/LabeledProgressBar';
import { useStyles } from './styles';

interface ActiveVotingProgressProps {
  votedForMantissa?: BigNumber;
  votedAgainstMantissa?: BigNumber;
  abstainedMantissa?: BigNumber;
  votedTotalMantissa?: BigNumber;
}

const getValueString = ({ xvs, valueMantissa }: { valueMantissa?: BigNumber; xvs?: Token }) =>
  valueMantissa &&
  xvs &&
  convertWeiToTokens({
    valueWei: valueMantissa,
    token: xvs,
    returnInReadableFormat: true,
  });

export const ActiveVotingProgress: React.FC<ActiveVotingProgressProps> = ({
  votedForMantissa,
  votedAgainstMantissa,
  abstainedMantissa,
  votedTotalMantissa,
}) => {
  const styles = useStyles();
  const { t } = useTranslation();
  const xvs = useGetToken({
    symbol: 'XVS',
  });

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
        value: getValueString({ valueMantissa: votedForMantissa, xvs }),
        progressBarProps: {
          ariaLabel: t('voteProposalUi.statusCard.ariaLabelFor'),
          value:
            votedForMantissa
              ?.dividedBy(votedTotalMantissa || 0)
              .times(100)
              .toNumber() || 0,
        },
      },
      {
        id: 'against',
        label: t('vote.against'),
        value: getValueString({ valueMantissa: votedAgainstMantissa, xvs }),
        progressBarProps: {
          successColor: PALETTE.interactive.error50,
          ariaLabel: t('voteProposalUi.statusCard.ariaLabelAgainst'),
          value:
            votedAgainstMantissa
              ?.dividedBy(votedTotalMantissa || 0)
              .times(100)
              .toNumber() || 0,
        },
      },
      {
        id: 'abstain',
        label: t('vote.abstain'),
        value: getValueString({ valueMantissa: abstainedMantissa, xvs }),
        progressBarProps: {
          successColor: PALETTE.text.secondary,
          ariaLabel: t('voteProposalUi.statusCard.ariaLabelAbstain'),
          value:
            abstainedMantissa
              ?.dividedBy(votedTotalMantissa || 0)
              .times(100)
              .toNumber() || 0,
        },
      },
    ],
    [votedForMantissa, votedAgainstMantissa, abstainedMantissa, xvs],
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
