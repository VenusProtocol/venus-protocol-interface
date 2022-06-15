/** @jsxImportSource @emotion/react */
import React, { useMemo } from 'react';
import { Typography } from '@mui/material';
import { Icon } from 'components';
import { useTranslation } from 'translation';
import { IProposal, ProposalState } from 'types';
import { useStyles } from './styles';

export interface IStepperProps {
  className?: string;
  proposal: IProposal;
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
      return 3;
    default:
      return 5;
  }
};

const Stepper: React.FC<IStepperProps> = ({ className, proposal }) => {
  const styles = useStyles();
  const { t } = useTranslation();

  const steps = useMemo(
    () => [
      {
        getLabel: () => t('voteProposalUi.statusCard.created'),
        getTimestamp: () => proposal.createdDate,
        completedIcon: () => (
          <span css={[styles.iconContainer, styles.markIconContainer]}>
            <Icon name="mark" css={styles.markIcon} />
          </span>
        ),
      },
      {
        getLabel: () => t('voteProposalUi.statusCard.active'),
        getTimestamp: () => proposal.startDate,
        completedIcon: () => (
          <span css={[styles.iconContainer, styles.markIconContainer]}>
            <Icon name="mark" css={styles.markIcon} />
          </span>
        ),
      },
      {
        getLabel: () => {
          switch (proposal.state) {
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
          if (proposal.state === 'Canceled') {
            return proposal.cancelDate;
          }

          if (proposal.state === 'Pending' || proposal.state === 'Active') {
            return undefined;
          }

          return proposal.endDate;
        },
        completedIcon: () => {
          if (
            proposal.state === 'Canceled' ||
            proposal.state === 'Defeated' ||
            proposal.state === 'Expired'
          ) {
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
        getTimestamp: () => proposal.queuedDate,
        completedIcon: () => (
          <span css={[styles.iconContainer, styles.markIconContainer]}>
            <Icon name="mark" css={styles.markIcon} />
          </span>
        ),
      },
      {
        getLabel: () => t('voteProposalUi.statusCard.execute'),
        getTimestamp: () => proposal.executedDate,
        completedIcon: () => (
          <span css={[styles.iconContainer, styles.markIconContainer]}>
            <Icon name="mark" css={styles.markIcon} />
          </span>
        ),
      },
    ],
    [JSON.stringify(proposal)],
  );
  const activeStepIndex = getActiveStepIndex(proposal.state);
  return (
    <div className={className} css={styles.root}>
      {steps.map((step, idx) => {
        const completed = activeStepIndex > idx;
        return (
          <>
            <div key={step.getLabel()} css={styles.step}>
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
              <Typography variant="tiny" css={styles.dateDefault}>
                {step.getTimestamp() &&
                  t('voteProposalUi.statusCard.dateAndTime', { date: step.getTimestamp() })}
              </Typography>
            </div>
            {idx + 1 !== steps.length && <div css={styles.connector} />}
          </>
        );
      })}
    </div>
  );
};

export default Stepper;
