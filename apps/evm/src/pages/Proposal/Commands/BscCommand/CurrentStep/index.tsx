import { useMemo } from 'react';

import { useTranslation } from 'libs/translations';
import { type Proposal, ProposalState } from 'types';
import { getProposalStateLabel } from 'utilities';
import { Status, type StatusProps } from '../../Status';

export type CurrentStepProps = React.HTMLAttributes<HTMLDivElement> &
  Pick<
    Proposal,
    | 'state'
    | 'startDate'
    | 'endDate'
    | 'createdDate'
    | 'cancelDate'
    | 'queuedDate'
    | 'executedDate'
    | 'executionEtaDate'
    | 'expiredDate'
  >;

export const CurrentStep: React.FC<CurrentStepProps> = ({
  state,
  createdDate,
  cancelDate,
  startDate,
  endDate,
  queuedDate,
  executedDate,
  executionEtaDate,
  expiredDate,
  ...otherProps
}) => {
  const { t } = useTranslation();

  const [type, status] = useMemo<[StatusProps['type'], string]>(() => {
    let tmpType: StatusProps['type'] = 'info';

    const tmpStatus = getProposalStateLabel({ state });

    if (
      state === ProposalState.Canceled ||
      state === ProposalState.Defeated ||
      state === ProposalState.Expired
    ) {
      tmpType = 'error';
    } else if (state === ProposalState.Executed) {
      tmpType = 'success';
    }

    return [tmpType, tmpStatus];
  }, [state]);

  const previousStepDate = useMemo(() => {
    if (state === ProposalState.Pending) {
      return createdDate;
    }

    if (state === ProposalState.Canceled) {
      return cancelDate;
    }

    if (state === ProposalState.Active) {
      return startDate;
    }

    if (state === ProposalState.Defeated) {
      return endDate;
    }

    if (state === ProposalState.Queued) {
      return queuedDate;
    }

    if (state === ProposalState.Executed) {
      return executedDate;
    }

    if (state === ProposalState.Expired) {
      return expiredDate;
    }
  }, [state, startDate, createdDate, cancelDate, queuedDate, executedDate, endDate, expiredDate]);

  const subDescription = useMemo(() => {
    if (state === ProposalState.Pending) {
      return t('voteProposalUi.command.dates.activeAt', {
        date: startDate,
      });
    }

    if (state === ProposalState.Active) {
      return t('voteProposalUi.command.dates.queueableAt', {
        date: endDate,
      });
    }

    if (state === ProposalState.Queued) {
      return t('voteProposalUi.command.dates.executableAt', {
        date: executionEtaDate,
      });
    }
  }, [t, state, startDate, endDate, executionEtaDate]);

  return (
    <Status
      {...otherProps}
      type={type}
      status={status}
      description={
        previousStepDate
          ? t('voteProposalUi.command.dates.previousStep', { date: previousStepDate })
          : undefined
      }
      subDescription={subDescription}
    />
  );
};
