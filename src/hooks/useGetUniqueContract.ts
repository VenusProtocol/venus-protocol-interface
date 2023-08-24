import { UniqueContractName, getUniqueContract } from 'packages/contracts';
import { useMemo } from 'react';

import { useAuth } from 'context/AuthContext';

export interface UseGetUniqueContractInput<TContractName extends UniqueContractName> {
  name: TContractName;
}

function useGetUniqueContract<TContractName extends UniqueContractName>({
  name,
}: UseGetUniqueContractInput<TContractName>) {
  const { signer, provider, chainId } = useAuth();
  const signerOrProvider = signer || provider;

  return useMemo(
    () =>
      chainId !== undefined
        ? getUniqueContract({
            name,
            chainId,
            signerOrProvider,
          })
        : undefined,
    [signerOrProvider, chainId, name],
  );
}

export interface UseGetUniqueContractAddress<TContractName extends UniqueContractName> {
  name: TContractName;
}

export default useGetUniqueContract;
