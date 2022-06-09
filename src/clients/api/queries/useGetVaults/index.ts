import { useMemo } from 'react';
import { Vault } from 'types';
import useGetVestingVaults from './useGetVestingVaults';
import useGetVaiVault from './useGetVaiVault';

export interface UseGetVaultsOutput {
  isLoading: boolean;
  data: Vault[];
}

// TODO: fetch non-vesting vaults (see https://app.clickup.com/t/2dfqc2m)
const useGetVaults = ({ accountAddress }: { accountAddress?: string }): UseGetVaultsOutput => {
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
