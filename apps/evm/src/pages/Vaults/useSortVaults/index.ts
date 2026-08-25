import { useGetToken } from 'libs/tokens';
import type { Vault } from 'types';
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

    return b.stakeAprPercentage - a.stakeAprPercentage;
  });
};
