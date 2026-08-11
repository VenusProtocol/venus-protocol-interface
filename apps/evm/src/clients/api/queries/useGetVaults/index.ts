import type { Vault } from 'types';

import type { Address } from 'viem';
import { useGetFormattedFixedRatedVaults } from './useGetFormattedFixedRatedVaults';
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

  const { data: fixedRatedVaults, isLoading: isVaultProductsLoading } =
    useGetFormattedFixedRatedVaults();

  const data = [
    ...(fixedRatedVaults ?? []),
    ...vestingVaults,
    ...(vaiVault ? [vaiVault] : []),
  ] as Vault[];

  const isLoading = isGetVestingVaultsLoading || isVaiVaultLoading || isVaultProductsLoading;

  return {
    data,
    isLoading,
  };
};
