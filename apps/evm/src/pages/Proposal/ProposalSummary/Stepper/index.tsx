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
    case ProposalState.Active:
      return 1;
    case ProposalState.Defeated:
    case ProposalState.Succeeded:
    case ProposalState.Canceled:
      return 2;
    case ProposalState.Queued:
      return 3;
    case ProposalState.Expired:
    case ProposalState.Executed:
      return 4;
    // Pending case
    default:
      return 0;
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

  const steps = useMemo(() => {
    const SuccessIcon = () => (
      <span css={[styles.iconContainer, styles.markIconContainer]}>
        <Icon name="mark" css={styles.markIcon} className="text-offWhite" />
      </span>
    );

    const FailIcon = () => (
      <span css={[styles.iconContainer, styles.errorIconContainer]}>
        <Icon name="closeRounded" css={styles.closeIcon} />
      </span>
    );

    return [
      {
        getLabel: () => t('proposalState.created'),
        getTimestamp: () => createdDate,
        completedIcon: SuccessIcon,
      },
      {
        getLabel: () => t('proposalState.active'),
        getTimestamp: () => startDate,
        completedIcon: SuccessIcon,
      },
      {
        getLabel: () => {
          if (state === ProposalState.Canceled) {
            return t('proposalState.canceled');
          }

          if (state === ProposalState.Defeated) {
            return t('proposalState.defeated');
          }

          return t('proposalState.succeeded');
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
        completedIcon:
          state === ProposalState.Canceled || state === ProposalState.Defeated
            ? FailIcon
            : SuccessIcon,
      },
      {
        getLabel: () => t('proposalState.queued'),
        getTimestamp: () => queuedDate,
        completedIcon: SuccessIcon,
      },
      {
        getLabel: () =>
          state === ProposalState.Expired
            ? t('proposalState.expired')
            : t('proposalState.executed'),
        getTimestamp: () => (state === ProposalState.Expired ? undefined : executedDate),
        completedIcon: state === ProposalState.Expired ? FailIcon : SuccessIcon,
      },
    ];
  }, [
    createdDate,
    startDate,
    cancelDate,
    queuedDate,
    executedDate,
    state,
    endDate,
    t,
    styles.closeIcon,
    styles.errorIconContainer,
    styles.iconContainer,
    styles.markIcon,
    styles.markIconContainer,
  ]);
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
