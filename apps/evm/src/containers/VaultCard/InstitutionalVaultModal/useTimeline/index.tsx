import { useNow } from 'hooks/useNow';
import { useTranslation } from 'libs/translations';
import { type InstitutionalVault, VaultStatus } from 'types';
import type { TimelineCheckpoint } from '../types';
import { getCheckpointDescription } from './getCheckPointDescription';
import { getCheckpointStatus } from './getCheckpointStatus';

export const useTimeline = ({ vault }: { vault: InstitutionalVault }) => {
  const { t } = useTranslation();

  const now = useNow();

  const checkpoints: TimelineCheckpoint[] = [
    {
      title: t('vault.modals.institutionalTimeline.depositPeriod'),
      description: getCheckpointDescription({
        startDate: vault.vaultDeploymentDate,
        endDate: vault.openEndDate,
        t,
      }),
      status: getCheckpointStatus({
        vault,
        now,
        endDate: vault.openEndDate,
        status: VaultStatus.Deposit,
      }),
    },
  ];

  if (vault.status === VaultStatus.Refund) {
    checkpoints.push({
      title: t('vault.modals.institutionalTimeline.refundPeriod'),
      description: getCheckpointDescription({
        startDate: vault.openEndDate,
        t,
      }),
      status: getCheckpointStatus({
        vault,
        now,
        status: VaultStatus.Refund,
      }),
    });
  } else {
    checkpoints.push(
      {
        title: t('vault.modals.institutionalTimeline.estimatedEarningPeriod'),
        description: getCheckpointDescription({
          startDate: vault.openEndDate,
          endDate: vault.lockEndDate,
          t,
        }),
        status: getCheckpointStatus({
          vault,
          now,
          endDate: vault.lockEndDate,
          status: VaultStatus.Earning,
        }),
      },
      {
        title: t('vault.modals.institutionalTimeline.estimatedRepayingPeriod'),
        description: getCheckpointDescription({
          startDate: vault.lockEndDate,
          endDate: vault.maturityDate ?? vault.settlementDate,
          t,
        }),
        status: getCheckpointStatus({
          vault,
          now,
          endDate: vault.maturityDate ?? vault.settlementDate,
          status: VaultStatus.Repaying,
        }),
      },
      {
        title: t('vault.modals.institutionalTimeline.claimPeriod'),
        description: getCheckpointDescription({
          startDate: vault.settlementDate,
          t,
        }),
        status: getCheckpointStatus({
          vault,
          now,
          status: VaultStatus.Claim,
        }),
      },
    );
  }

  return { checkpoints };
};
