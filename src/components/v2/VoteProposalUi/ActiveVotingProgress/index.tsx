/** @jsxImportSource @emotion/react */
import React, { useMemo } from 'react';
import Typography from '@mui/material/Typography';
import { useTranslation } from 'translation';
import { PALETTE } from 'theme/MuiThemeProvider/muiTheme';
import { ProgressBar } from '../../ProgressBar';
import { useStyles } from '../styles';

interface IActiveVotingProgressProps {
  votedFor?: string;
  votedAgainst?: string;
  abstain?: string;
}

export const ActiveVotingProgress: React.FC<IActiveVotingProgressProps> = ({
  votedFor,
  votedAgainst,
  abstain,
}) => {
  const styles = useStyles();
  const { t } = useTranslation();

  const activeProposalVotingData = useMemo(
    () => [
      {
        id: 'for',
        label: t('voteProposalUi.statusCard.for'),
        value: votedFor,
        progressBarProps: {
          // TODO: calculating progress
          ariaLabel: 'votes for',
          value: 20,
          step: 1,
          min: 1,
          max: 100,
        },
      },
      {
        id: 'against',
        label: t('voteProposalUi.statusCard.against'),
        value: votedAgainst,
        progressBarProps: {
          // TODO: calculating progress
          progressColorOverride: PALETTE.interactive.error50,
          ariaLabel: 'votes against',
          value: 20,
          step: 1,
          min: 1,
          max: 100,
        },
      },
      {
        id: 'abstain',
        label: t('voteProposalUi.statusCard.abstain'),
        value: abstain,
        progressBarProps: {
          // TODO: calculating progress
          progressColorOverride: PALETTE.text.secondary,
          ariaLabel: 'votes abstain',
          value: 20,
          step: 1,
          min: 1,
          max: 100,
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
            <ProgressBar {...progressBarProps} />
          </React.Fragment>
        );
      })}
    </>
  );
};
