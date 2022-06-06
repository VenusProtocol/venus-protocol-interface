import { Vault } from 'types';

import useGetVestingVaults from './useGetVestingVaults';

export interface UseGetVaultsOutput {
  isLoading: boolean;
  data: Vault[];
}

const useGetVaults = ({ accountAddress }: { accountAddress?: string }): UseGetVaultsOutput => {
  const { data: vestingVaults, isLoading: isGetVestingVaultsLoading } = useGetVestingVaults({
    accountAddress,
  });

  // TODO: fetch non-vesting vaults (see https://app.clickup.com/t/2dfqc2m)

  return {
    data: vestingVaults,
    isLoading: isGetVestingVaultsLoading,
  };
};

export default useGetVaults;
