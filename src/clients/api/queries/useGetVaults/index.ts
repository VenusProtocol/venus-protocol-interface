import { useMemo } from 'react';
import { Vault } from 'types';

import useGetVaiVault from './useGetVaiVault';
import useGetVestingVaults from './useGetVestingVaults';
import useGetVrtVault from './useGetVrtVault';

export interface UseGetVaultsOutput {
  isLoading: boolean;
  data: Vault[];
}

const useGetVaults = ({ accountAddress }: { accountAddress?: string }): UseGetVaultsOutput => {
  const { data: vestingVaults, isLoading: isGetVestingVaultsLoading } = useGetVestingVaults({
    accountAddress,
  });

  const { data: vaiVault, isLoading: isVaiVaultLoading } = useGetVaiVault({
    accountAddress,
  });

  const { data: vrtVault, isLoading: isVrtVaultLoading } = useGetVrtVault({
    accountAddress,
  });

  const data: Vault[] = useMemo(() => {
    const allVaults = [...vestingVaults];

    if (vaiVault) {
      allVaults.push(vaiVault);
    }

    if (vrtVault) {
      allVaults.push(vrtVault);
    }

    return allVaults;
  }, [JSON.stringify(vestingVaults), JSON.stringify(vaiVault), JSON.stringify(vrtVault)]);

  const isLoading = isGetVestingVaultsLoading || isVaiVaultLoading || isVrtVaultLoading;

  return {
    data,
    isLoading,
  };
};

export default useGetVaults;
