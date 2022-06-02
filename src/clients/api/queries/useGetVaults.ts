// import FunctionKey from 'constants/functionKey';
import { Vault } from 'types';
import useGetXvsVaultPoolsCount from './useGetXvsVaultPoolsCount';

export interface UseGetVaultsOutput {
  isLoading: boolean;
  data: Vault[];
}

const useGetVaults = ({ accountAddress }: { accountAddress?: string }): UseGetVaultsOutput => {
  //
  const { data: xvsVaultPoolLength } = useGetXvsVaultPoolsCount();

  console.log(xvsVaultPoolLength, accountAddress);

  return {
    data: [],
    isLoading: false,
    // TODO: handle errors and retry scenarios
  };
};

export default useGetVaults;
