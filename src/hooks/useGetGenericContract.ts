import { GenericContractName, getGenericContract } from 'packages/contracts';
import { useMemo } from 'react';

import { useAuth } from 'context/AuthContext';

export interface UseGetGenericContractInput<TContractName extends GenericContractName> {
  name: TContractName;
  address: string;
}

function useGetGenericContract<TContractName extends GenericContractName>({
  name,
  address,
}: UseGetGenericContractInput<TContractName>) {
  const { signer, provider, chainId } = useAuth();
  const signerOrProvider = signer || provider;

  return useMemo(
    () =>
      chainId !== undefined // Although chainId isn't used, we don't want to fetch any data unless it exists
        ? getGenericContract({
            name,
            address,
            signerOrProvider,
          })
        : undefined,
    [signerOrProvider, name, address, chainId],
  );
}

export default useGetGenericContract;
