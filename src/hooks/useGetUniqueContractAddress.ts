import { UniqueContractName, getUniqueContractAddress } from 'packages/contracts';
import { useMemo } from 'react';

import { useAuth } from 'context/AuthContext';

export interface UseGetUniqueContractAddress<TContractName extends UniqueContractName> {
  name: TContractName;
}

// TODO: move to contracts package
function useGetUniqueContractAddress<TContractName extends UniqueContractName>({
  name,
}: UseGetUniqueContractAddress<TContractName>) {
  const { chainId } = useAuth();

  return useMemo(
    () =>
      getUniqueContractAddress({
        name,
        chainId,
      }),
    [chainId],
  );
}

export default useGetUniqueContractAddress;
