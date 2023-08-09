import config from 'config';
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
  const { signer, provider } = useAuth();
  const signerOrProvider = signer || provider;
  // TODO: get from auth context. Right now the config defines the chain ID and so the dApp only
  // needs to support one chain, but since our goal is to become multichain then the chain ID needs
  // to be considered dynamic.
  const { chainId } = config;

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
