import { cn } from '@venusprotocol/ui';
import { isBefore } from 'date-fns/isBefore';

import { LabeledInlineContent, type LabeledInlineContentProps } from 'components';
import { useNow } from 'hooks/useNow';
import { useTranslation } from 'libs/translations';
import { type InstitutionalVault, VaultStatus } from 'types';
import { Timeline } from '../InstitutionalVaultModal/PositionTab/Footer/Timeline';
import { getCheckpointTimeRange } from '../InstitutionalVaultModal/useTimeline/getCheckpointTimeRange';

export interface InstitutionalCheckpointInlineContentProps
  extends Omit<LabeledInlineContentProps, 'label' | 'tooltip' | 'children'> {
  vault: InstitutionalVault;
}

export const InstitutionalCheckpointInlineContent: React.FC<
  InstitutionalCheckpointInlineContentProps
> = ({ vault, className, ...otherProps }) => {
  const { t } = useTranslation();
  const now = useNow();

  const isPendingBeforeOpenEndDate =
    vault.status === VaultStatus.Pending && !!vault.openEndDate && isBefore(now, vault.openEndDate);

  let label = t('vault.modals.maturityDate');
  let startDate = vault.maturityDate;

  if (vault.status === VaultStatus.Refund) {
    label = t('vault.modals.institutionalTimeline.refundPeriod');
    startDate = vault.openEndDate;
  } else if (
    vault.status === VaultStatus.Deposit ||
    !vault.openEndDate ||
    isPendingBeforeOpenEndDate
  ) {
    label = t('vault.modals.depositPeriodEnds');
    startDate = vault.openEndDate;
  }

  const timeRange = getCheckpointTimeRange({
    t,
    startDate,
  });

  return (
    <LabeledInlineContent
      {...otherProps}
      label={label}
      tooltip={<Timeline vault={vault} />}
      className={cn(className, 'flex-col gap-y-1 xs:flex-row')}
    >
      {timeRange || t('vault.timeline.tbd')}
    </LabeledInlineContent>
  );
};
