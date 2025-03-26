import { useMemo } from 'react';

import type { Vault } from 'types';

import type { Address } from 'viem';
import useGetVaiVault from './useGetVaiVault';
import useGetVestingVaults from './useGetVestingVaults';

export interface UseGetVaultsOutput {
  isLoading: boolean;
  data: Vault[];
}

const useGetVaults = ({ accountAddress }: { accountAddress?: Address }): UseGetVaultsOutput => {
  const { data: vestingVaults, isLoading: isGetVestingVaultsLoading } = useGetVestingVaults({
    accountAddress,
  });

  const { data: vaiVault, isLoading: isVaiVaultLoading } = useGetVaiVault({
    accountAddress,
  });

  const data: Vault[] = useMemo(() => {
    const allVaults = [...vestingVaults];

    if (vaiVault) {
      allVaults.push(vaiVault);
    }

    return allVaults;
  }, [vestingVaults, vaiVault]);

  const isLoading = isGetVestingVaultsLoading || isVaiVaultLoading;

  return {
    data,
    isLoading,
  };
};

export default useGetVaults;
