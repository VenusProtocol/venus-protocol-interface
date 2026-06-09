import type { useTranslation } from 'libs/translations';
import { type InstitutionalVault, VaultStatus } from 'types';

export const getCheckpointDescription = ({
  vault,
  status,
  t,
}: {
  vault: InstitutionalVault;
  status: VaultStatus;
  t: ReturnType<typeof useTranslation>['t'];
}) => {
  if (status === VaultStatus.Deposit) {
    return t('vault.timeline.description.deposit', {
      tokenSymbol: vault.stakedToken.symbol,
    });
  }

  if (status === VaultStatus.Locked) {
    return t('vault.timeline.description.locked');
  }

  if (status === VaultStatus.Repaying) {
    return t('vault.timeline.description.repaying');
  }

  if (status === VaultStatus.Claim) {
    return t('vault.timeline.description.claim');
  }

  if (status === VaultStatus.Refund) {
    return t('vault.timeline.description.refund');
  }

  return undefined;
};
