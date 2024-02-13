/** @jsxImportSource @emotion/react */
import { Typography } from '@mui/material';
import { Fragment, useMemo } from 'react';

import { Icon } from 'components';
import { useTranslation } from 'libs/translations';
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
    case ProposalState.Pending:
      return 0;
    case ProposalState.Active:
      return 1;
    case ProposalState.Defeated:
    case ProposalState.Succeeded:
    case ProposalState.Canceled:
    case ProposalState.Expired:
      return 2;
    case ProposalState.Queued:
      return 3;
    default:
      return 4;
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
            <Icon name="mark" css={styles.markIcon} className="text-offWhite" />
          </span>
        ),
      },
      {
        getLabel: () => t('voteProposalUi.statusCard.active'),
        getTimestamp: () => startDate,
        completedIcon: () => (
          <span css={[styles.iconContainer, styles.markIconContainer]}>
            <Icon name="mark" css={styles.markIcon} className="text-offWhite" />
          </span>
        ),
      },
      {
        getLabel: () => {
          switch (state) {
            case ProposalState.Canceled:
              return t('voteProposalUi.statusCard.canceled');
            case ProposalState.Defeated:
              return t('voteProposalUi.statusCard.defeated');
            case ProposalState.Expired:
              return t('voteProposalUi.statusCard.expired');
            default:
              return t('voteProposalUi.statusCard.succeed');
          }
        },
        getTimestamp: () => {
          if (state === ProposalState.Canceled) {
            return cancelDate;
          }

          if (state === ProposalState.Pending || state === ProposalState.Active) {
            return undefined;
          }

          return endDate;
        },
        completedIcon: () => {
          if (
            state === ProposalState.Canceled ||
            state === ProposalState.Defeated ||
            state === ProposalState.Expired
          ) {
            return (
              <span css={[styles.iconContainer, styles.errorIconContainer]}>
                <Icon name="closeRounded" css={styles.closeIcon} />
              </span>
            );
          }
          return (
            <span css={[styles.iconContainer, styles.markIconContainer]}>
              <Icon name="mark" css={styles.markIcon} className="text-offWhite" />
            </span>
          );
        },
      },
      {
        getLabel: () => t('voteProposalUi.statusCard.queue'),
        getTimestamp: () => queuedDate,
        completedIcon: () => (
          <span css={[styles.iconContainer, styles.markIconContainer]}>
            <Icon name="mark" css={styles.markIcon} className="text-offWhite" />
          </span>
        ),
      },
      {
        getLabel: () => t('voteProposalUi.statusCard.execute'),
        getTimestamp: () => executedDate,
        completedIcon: () => (
          <span css={[styles.iconContainer, styles.markIconContainer]}>
            <Icon name="mark" css={styles.markIcon} className="text-offWhite" />
          </span>
        ),
      },
    ],
    [createdDate, startDate, cancelDate, queuedDate, executedDate, state, endDate, t],
  );
  const activeStepIndex = getActiveStepIndex(state);

  return (
    <div className={className} css={styles.root}>
      {steps.map((step, idx) => {
        const completed = activeStepIndex >= idx;
        const active = state === ProposalState.Active && activeStepIndex === idx;

        return (
          <Fragment key={step.getLabel()}>
            <div css={styles.step}>
              <div css={styles.labelAndIcon}>
                {completed ? (
                  step.completedIcon()
                ) : (
                  <span css={[styles.iconContainer, styles.getNumberIconContainer({ active })]}>
                    <Typography variant="tiny" css={styles.getNumberIconText({ active })}>
                      {idx + 1}
                    </Typography>
                  </span>
                )}
                <Typography variant="small1" css={styles.labelText({ completed, active })}>
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
          </Fragment>
        );
      })}
    </div>
  );
};

export default Stepper;
