import { useGetToken } from 'libs/tokens';
import type { Vault } from 'types';
import { getVaultApyPercentage } from './getVaultApyPercentage';
import { getVaultDeploymentTimestampMs } from './getVaultDeploymentTimestampMs';
import { getVaultTier } from './getVaultTier';

export const useSortVaults = ({ vaults }: { vaults: Vault[] }) => {
  const xvs = useGetToken({
    symbol: 'XVS',
  });

  const vai = useGetToken({
    symbol: 'VAI',
  });

  return [...vaults].sort((a, b) => {
    const aTier = getVaultTier({ vault: a, xvs, vai });
    const bTier = getVaultTier({ vault: b, xvs, vai });

    if (aTier !== bTier) {
      return aTier - bTier;
    }

    const aApyPercentage = getVaultApyPercentage({ vault: a });
    const bApyPercentage = getVaultApyPercentage({ vault: b });

    if (aApyPercentage === undefined && bApyPercentage !== undefined) {
      return 1;
    }

    if (bApyPercentage === undefined && aApyPercentage !== undefined) {
      return -1;
    }

    if (
      aApyPercentage !== undefined &&
      bApyPercentage !== undefined &&
      aApyPercentage !== bApyPercentage
    ) {
      return bApyPercentage - aApyPercentage;
    }

    const aDeploymentTimestampMs = getVaultDeploymentTimestampMs({ vault: a });
    const bDeploymentTimestampMs = getVaultDeploymentTimestampMs({ vault: b });

    if (aDeploymentTimestampMs === undefined && bDeploymentTimestampMs !== undefined) {
      return 1;
    }

    if (bDeploymentTimestampMs === undefined && aDeploymentTimestampMs !== undefined) {
      return -1;
    }

    if (
      aDeploymentTimestampMs !== undefined &&
      bDeploymentTimestampMs !== undefined &&
      aDeploymentTimestampMs !== bDeploymentTimestampMs
    ) {
      return bDeploymentTimestampMs - aDeploymentTimestampMs;
    }

    return b.stakeBalanceCents - a.stakeBalanceCents;
  });
};
