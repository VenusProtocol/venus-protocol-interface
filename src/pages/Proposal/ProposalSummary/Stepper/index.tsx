/** @jsxImportSource @emotion/react */
import { Typography } from '@mui/material';
import { Icon } from 'components';
import React, { useMemo } from 'react';
import { useTranslation } from 'translation';
import { ProposalState } from 'types';

import { useStyles } from './styles';

export interface StepperProps {
  className?: string;
  createdDate: Date | undefined;
  startDate: Date | undefined;
  cancelDate: Date | undefined;
  queuedDate: Date | undefined;
  executedDate: Date | undefined;
  endDate: Date | undefined;
  state: ProposalState;
}

const getActiveStepIndex = (proposalState: ProposalState) => {
  switch (proposalState) {
    case 'Pending':
      return 1;
    case 'Active':
      return 2;
    case 'Defeated':
    case 'Succeeded':
    case 'Canceled':
    case 'Expired':
      return 3;
    case 'Queued':
      return 4;
    default:
      return 5;
  }
};

const Stepper: React.FC<StepperProps> = ({
  className,
  createdDate,
  startDate,
  cancelDate,
  queuedDate,
  executedDate,
  endDate,
  state,
}) => {
  const styles = useStyles();
  const { t } = useTranslation();

  const steps = useMemo(
    () => [
      {
        getLabel: () => t('voteProposalUi.statusCard.created'),
        getTimestamp: () => createdDate,
        completedIcon: () => (
          <span css={[styles.iconContainer, styles.markIconContainer]}>
            <Icon name="mark" css={styles.markIcon} />
          </span>
        ),
      },
      {
        getLabel: () => t('voteProposalUi.statusCard.active'),
        getTimestamp: () => startDate,
        completedIcon: () => (
          <span css={[styles.iconContainer, styles.markIconContainer]}>
            <Icon name="mark" css={styles.markIcon} />
          </span>
        ),
      },
      {
        getLabel: () => {
          switch (state) {
            case 'Canceled':
              return t('voteProposalUi.statusCard.canceled');
            case 'Defeated':
              return t('voteProposalUi.statusCard.defeated');
            case 'Expired':
              return t('voteProposalUi.statusCard.expired');
            default:
              return t('voteProposalUi.statusCard.succeed');
          }
        },
        getTimestamp: () => {
          if (state === 'Canceled') {
            return cancelDate;
          }

          if (state === 'Pending' || state === 'Active') {
            return undefined;
          }

          return endDate;
        },
        completedIcon: () => {
          if (state === 'Canceled' || state === 'Defeated' || state === 'Expired') {
            return (
              <span css={[styles.iconContainer, styles.errorIconContainer]}>
                <Icon name="close" css={styles.closeIcon} />
              </span>
            );
          }
          return (
            <span css={[styles.iconContainer, styles.markIconContainer]}>
              <Icon name="mark" css={styles.markIcon} />
            </span>
          );
        },
      },
      {
        getLabel: () => t('voteProposalUi.statusCard.queue'),
        getTimestamp: () => queuedDate,
        completedIcon: () => (
          <span css={[styles.iconContainer, styles.markIconContainer]}>
            <Icon name="mark" css={styles.markIcon} />
          </span>
        ),
      },
      {
        getLabel: () => t('voteProposalUi.statusCard.execute'),
        getTimestamp: () => executedDate,
        completedIcon: () => (
          <span css={[styles.iconContainer, styles.markIconContainer]}>
            <Icon name="mark" css={styles.markIcon} />
          </span>
        ),
      },
    ],
    [createdDate, startDate, cancelDate, queuedDate, executedDate, state],
  );
  const activeStepIndex = getActiveStepIndex(state);
  return (
    <div className={className} css={styles.root}>
      {steps.map((step, idx) => {
        const completed = activeStepIndex > idx;
        return (
          <React.Fragment key={step.getLabel()}>
            <div css={styles.step}>
              <div css={styles.labelAndIcon}>
                {completed ? (
                  step.completedIcon()
                ) : (
                  <span css={[styles.iconContainer, styles.numberIconContainer]}>
                    <Typography variant="tiny" color="textSecondary">
                      {idx + 1}
                    </Typography>
                  </span>
                )}
                <Typography variant="small1" css={styles.labelText({ completed })}>
                  {step.getLabel()}
                  {step.getTimestamp() && (
                    <Typography variant="tiny" css={styles.dateTablet}>
                      {t('voteProposalUi.statusCard.dateOnly', { date: step.getTimestamp() })}
                      <br />
                      {t('voteProposalUi.statusCard.timeOnly', { date: step.getTimestamp() })}
                    </Typography>
                  )}
                </Typography>
              </div>
              {step.getTimestamp() && (
                <Typography variant="tiny" css={styles.dateDefault}>
                  {t('voteProposalUi.statusCard.dateOnly', { date: step.getTimestamp() })}&nbsp;
                  {t('voteProposalUi.statusCard.timeOnly', { date: step.getTimestamp() })}
                </Typography>
              )}
            </div>
            {idx + 1 !== steps.length && <div css={styles.connector} />}
          </React.Fragment>
        );
      })}
    </div>
  );
};

export default Stepper;
