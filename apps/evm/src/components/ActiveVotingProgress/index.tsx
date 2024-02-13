/** @jsxImportSource @emotion/react */
import { BigNumber } from 'bignumber.js';
import { useMemo } from 'react';

import { useTranslation } from 'libs/translations';
import { theme } from 'theme';
import { Token } from 'types';
import { convertMantissaToTokens } from 'utilities';

import { LabeledProgressBar } from '../ProgressBar/LabeledProgressBar';
import { useStyles } from './styles';

interface ActiveVotingProgressProps {
  xvs?: Token;
  votedForMantissa?: BigNumber;
  votedAgainstMantissa?: BigNumber;
  abstainedMantissa?: BigNumber;
  votedTotalMantissa?: BigNumber;
}

const getValueString = ({ xvs, valueMantissa }: { valueMantissa?: BigNumber; xvs?: Token }) =>
  valueMantissa &&
  xvs &&
  convertMantissaToTokens({
    value: valueMantissa,
    token: xvs,
    returnInReadableFormat: true,
  });

export const ActiveVotingProgress: React.FC<ActiveVotingProgressProps> = ({
  xvs,
  votedForMantissa,
  votedAgainstMantissa,
  abstainedMantissa,
  votedTotalMantissa,
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
          progressBarColor: theme.colors.red,
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
          progressBarColor: theme.colors.grey,
          ariaLabel: t('voteProposalUi.statusCard.ariaLabelAbstain'),
          value:
            abstainedMantissa
              ?.dividedBy(votedTotalMantissa || 0)
              .times(100)
              .toNumber() || 0,
        },
      },
    ],
    [votedForMantissa, votedAgainstMantissa, abstainedMantissa, xvs, votedTotalMantissa, t],
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
