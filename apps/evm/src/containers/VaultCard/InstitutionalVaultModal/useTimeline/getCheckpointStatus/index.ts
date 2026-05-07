import { isBefore } from 'date-fns/isBefore';

import type { InstitutionalVault, VaultStatus } from 'types';

export type CheckpointStatus = 'passed' | 'ongoing' | 'upcoming';

export const getCheckpointStatus = ({
  vault,
  status,
  now,
  endDate,
}: {
  vault: InstitutionalVault;
  status: VaultStatus;
  now: Date;
  endDate?: Date;
}): CheckpointStatus => {
  if (endDate && isBefore(endDate, now)) {
    return 'passed';
  }

  if (vault.status === status) {
    return 'ongoing';
  }

  return 'upcoming';
};
