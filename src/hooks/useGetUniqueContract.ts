import config from 'config';
import { UniqueContractName, getUniqueContract } from 'packages/contracts';
import { useMemo } from 'react';

import { useAuth } from 'context/AuthContext';

export interface UseGetUniqueContractInput<TContractName extends UniqueContractName> {
  name: TContractName;
}

function useGetUniqueContract<TContractName extends UniqueContractName>({
  name,
}: UseGetUniqueContractInput<TContractName>) {
  const { signer, provider } = useAuth();
  const signerOrProvider = signer || provider;
  // TODO: get from auth context. Right now the config defines the chain ID and so the dApp only
  // needs to support one chain, but since our goal is to become multichain then the chain ID needs
  // to be considered dynamic.
  const { chainId } = config;

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
