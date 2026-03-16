import { useMemo } from 'react';

import type { AnyVault } from 'types';

import type { Address } from 'viem';
import { useGetPendleVaults } from './useGetPendleVaults';
import { useGetVaiVault } from './useGetVaiVault';
import { useGetVestingVaults } from './useGetVestingVaults';

export interface UseGetVaultsOutput {
  isLoading: boolean;
  data: AnyVault[];
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

  const { data: vaultProducts, isLoading: isVaultProductsLoading } = useGetPendleVaults();

  const data = useMemo(() => {
    const allVaults = [...vestingVaults] as AnyVault[];

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
