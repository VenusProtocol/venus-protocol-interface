import { GenericContractName, getGenericContract } from 'packages/contracts';
import { useMemo } from 'react';

import { useAuth } from 'context/AuthContext';

export interface UseGetGenericContractInput<TContractName extends GenericContractName> {
  name: TContractName;
  address: string;
  passSigner?: boolean;
}

function useGetGenericContract<TContractName extends GenericContractName>({
  name,
  address,
  passSigner = false,
}: UseGetGenericContractInput<TContractName>) {
  const { signer, provider } = useAuth();
  const signerOrProvider = passSigner ? signer : provider;

  return useMemo(
    () =>
      signerOrProvider
        ? getGenericContract({
            name,
            address,
            signerOrProvider,
          })
        : undefined,
    [signerOrProvider, name, address],
  );
}

export default useGetGenericContract;
