import { useMemo } from 'react';

import type { Vault } from 'types';

import type { Address } from 'viem';
import { useGetVaultProducts } from '../getVaultProducts/useGetVaultProducts';
import { useGetVaiVault } from './useGetVaiVault';
import { useGetVestingVaults } from './useGetVestingVaults';

export interface UseGetVaultsOutput {
  isLoading: boolean;
  data: Vault[];
}

export const useGetVaults = ({
  accountAddress,
}: { accountAddress?: Address }): UseGetVaultsOutput => {
  const { data: vestingVaults, isLoading: isGetVestingVaultsLoading } = useGetVestingVaults({
    accountAddress,
  });

  const { data: vaiVault, isLoading: isVaiVaultLoading } = useGetVaiVault({
    accountAddress,
  });

  const { data: vaultProducts, isLoading: isVaultProductsLoading } = useGetVaultProducts();

  const data: Vault[] = useMemo(() => {
    const allVaults = [...vestingVaults];

    if (vaiVault) {
      allVaults.push(vaiVault);
    }

    if (vaultProducts) {
      allVaults.push(...vaultProducts);
    }

    return allVaults;
  }, [vestingVaults, vaiVault, vaultProducts]);

  const isLoading = isGetVestingVaultsLoading || isVaiVaultLoading || isVaultProductsLoading;

  return {
    data,
    isLoading,
  };
};
