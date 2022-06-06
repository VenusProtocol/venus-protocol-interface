import { useMemo } from 'react';
import { Vault } from 'types';

import useGetVestingVaults from './useGetVestingVaults';
import useGetVaiVault from './useGetVaiVault';

export interface UseGetVaultsOutput {
  isLoading: boolean;
  data: Vault[];
}

const useGetVaults = ({ accountAddress }: { accountAddress?: string }): UseGetVaultsOutput => {
  const { data: vestingVaults, isLoading: isGetVestingVaultsLoading } = useGetVestingVaults({
    accountAddress,
  });

  const { data: vaultVault, isLoading: isVaiVaultLoading } = useGetVaiVault({
    accountAddress,
  });

  const data: Vault[] = useMemo(() => {
    const allVaults = [...vestingVaults];

    if (vaultVault) {
      allVaults.push(vaultVault);
    }

    // TODO: add VRT vault

    return allVaults;
  }, [JSON.stringify(vestingVaults), vaultVault]);

  const isLoading = isGetVestingVaultsLoading || isVaiVaultLoading;

  return {
    data,
    isLoading,
  };
};

export default useGetVaults;
