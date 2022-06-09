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

  const { data: vaiVault, isLoading: isVaiVaultLoading } = useGetVaiVault({
    accountAddress,
  });

  // TODO: fetch VRT vault

  const data: Vault[] = useMemo(() => {
    const allVaults = [...vestingVaults];

    if (vaiVault) {
      allVaults.push(vaiVault);
    }

    // TODO: add VRT vault

    return allVaults;
  }, [JSON.stringify(vestingVaults), vaiVault]);

  const isLoading = isGetVestingVaultsLoading || isVaiVaultLoading;

  return {
    data,
    isLoading,
  };
};

export default useGetVaults;
