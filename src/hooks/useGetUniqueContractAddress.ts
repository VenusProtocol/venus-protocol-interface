import { useAuth } from 'context/AuthContext';
import { UniqueContractName, getUniqueContractAddress } from 'packages/contracts';
import { useMemo } from 'react';

export interface UseGetUniqueContractAddress<TContractName extends UniqueContractName> {
  name: TContractName;
}

function useGetUniqueContractAddress<TContractName extends UniqueContractName>({
  name,
}: UseGetUniqueContractAddress<TContractName>) {
  const { chainId } = useAuth();

  return useMemo(
    () =>
      chainId !== undefined
        ? getUniqueContractAddress({
            name,
            chainId,
          })
        : undefined,
    [chainId],
  );
}

export default useGetUniqueContractAddress;
