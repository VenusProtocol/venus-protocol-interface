import { useNow } from 'hooks/useNow';
import { useTranslation } from 'libs/translations';
import { type InstitutionalVault, VaultStatus } from 'types';
import type { TimelineCheckpoint } from '../types';
import { getCheckpointDescription } from './getCheckpointDescription';
import { getCheckpointStatus } from './getCheckpointStatus';
import { getCheckpointTimeRange } from './getCheckpointTimeRange';

export const useTimeline = ({ vault }: { vault: InstitutionalVault }) => {
  const { t } = useTranslation();

  const now = useNow();

  const checkpoints: TimelineCheckpoint[] = [
    {
      title: t('vault.modals.institutionalTimeline.depositPeriod'),
      timeRange: getCheckpointTimeRange({
        startDate: vault.openStartDate,
        endDate: vault.openEndDate,
        t,
      }),
      status: getCheckpointStatus({
        vault,
        now,
        endDate: vault.openEndDate,
        status: VaultStatus.Deposit,
      }),
      description: getCheckpointDescription({
        status: VaultStatus.Deposit,
        t,
        vault,
      }),
    },
  ];

  if (vault.status === VaultStatus.Refund) {
    checkpoints.push({
      title: t('vault.modals.institutionalTimeline.refundPeriod'),
      timeRange: getCheckpointTimeRange({
        startDate: vault.openEndDate,
        t,
      }),
      status: getCheckpointStatus({
        vault,
        now,
        status: VaultStatus.Refund,
      }),
      description: getCheckpointDescription({
        status: VaultStatus.Refund,
        t,
        vault,
      }),
    });
  } else {
    checkpoints.push(
      {
        title: t('vault.modals.institutionalTimeline.estimatedLockedPeriod'),
        timeRange: getCheckpointTimeRange({
          startDate: vault.openEndDate,
          endDate: vault.lockEndDate,
          t,
        }),
        status: getCheckpointStatus({
          vault,
          now,
          endDate: vault.lockEndDate,
          status: VaultStatus.Locked,
        }),
        description: getCheckpointDescription({
          status: VaultStatus.Locked,
          t,
          vault,
        }),
      },
      {
        title: t('vault.modals.institutionalTimeline.estimatedRepayingPeriod'),
        timeRange: getCheckpointTimeRange({
          startDate: vault.lockEndDate,
          endDate: vault.settlementDate,
          t,
        }),
        status: getCheckpointStatus({
          vault,
          now,
          endDate: vault.settlementDate,
          status: VaultStatus.Repaying,
        }),
        description: getCheckpointDescription({
          status: VaultStatus.Repaying,
          t,
          vault,
        }),
      },
      {
        title: t('vault.modals.institutionalTimeline.claimPeriod'),
        timeRange: getCheckpointTimeRange({
          startDate: vault.settlementDate,
          t,
        }),
        status: getCheckpointStatus({
          vault,
          now,
          status: VaultStatus.Claim,
        }),
        description: getCheckpointDescription({
          status: VaultStatus.Claim,
          t,
          vault,
        }),
      },
    );
  }

  return { checkpoints };
};
