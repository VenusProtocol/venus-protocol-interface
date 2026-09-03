import { useGetToken } from 'libs/tokens';
import type { Vault } from 'types';
import { compareNumbersWithMissingLast } from 'utilities';
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
    const tierComparison =
      getVaultTier({ vault: a, xvs, vai }) - getVaultTier({ vault: b, xvs, vai });

    if (tierComparison !== 0) {
      return tierComparison;
    }

    const apyComparison = compareNumbersWithMissingLast(
      getVaultApyPercentage({ vault: a }),
      getVaultApyPercentage({ vault: b }),
      'desc',
    );

    if (apyComparison !== 0) {
      return apyComparison;
    }

    const deploymentComparison = compareNumbersWithMissingLast(
      getVaultDeploymentTimestampMs({ vault: a }),
      getVaultDeploymentTimestampMs({ vault: b }),
      'desc',
    );

    if (deploymentComparison !== 0) {
      return deploymentComparison;
    }

    return compareNumbersWithMissingLast(a.stakeBalanceCents, b.stakeBalanceCents, 'desc');
  });
};
