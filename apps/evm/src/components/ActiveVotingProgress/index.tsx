import { BigNumber } from 'bignumber.js';

import { useTranslation } from 'libs/translations';
import type { Token } from 'types';
import { convertMantissaToTokens } from 'utilities';

import { LabeledProgressBar } from '../LabeledProgressBar';

interface ActiveVotingProgressProps {
  xvs?: Token;
  votedForMantissa?: BigNumber;
  votedAgainstMantissa?: BigNumber;
  abstainedMantissa?: BigNumber;
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
}) => {
  const { t } = useTranslation();

  const votedTotalMantissa = new BigNumber(votedForMantissa ?? 0)
    .plus(votedAgainstMantissa ?? 0)
    .plus(abstainedMantissa ?? 0);

  const defaultProgressbarProps = {
    min: 0,
    max: 100,
  };

  const activeProposalVotingData = [
    {
      id: 'for',
      label: t('vote.for'),
      value: getValueString({ valueMantissa: votedForMantissa, xvs }),
      progressBarProps: {
        progressBars: [
          {
            value:
              votedForMantissa
                ?.dividedBy(votedTotalMantissa || 0)
                .times(100)
                .toNumber() || 0,
          },
        ],
      },
    },
    {
      id: 'against',
      label: t('vote.against'),
      value: getValueString({ valueMantissa: votedAgainstMantissa, xvs }),
      progressBarProps: {
        progressBars: [
          {
            value:
              votedAgainstMantissa
                ?.dividedBy(votedTotalMantissa || 0)
                .times(100)
                .toNumber() || 0,
            className: 'bg-red',
          },
        ],
      },
    },
    {
      id: 'abstain',
      label: t('vote.abstain'),
      value: getValueString({ valueMantissa: abstainedMantissa, xvs }),
      progressBarProps: {
        progressBars: [
          {
            value:
              abstainedMantissa
                ?.dividedBy(votedTotalMantissa || 0)
                .times(100)
                .toNumber() || 0,
            className: 'bg-grey',
          },
        ],
      },
    },
  ];

  return (
    <div className="flex w-full flex-col space-y-6">
      {activeProposalVotingData.map(({ id, label, value, progressBarProps }) => {
        if (!value) {
          return null;
        }

        return (
          <div key={id}>
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
