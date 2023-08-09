import config from 'config';
import { UniqueContractName, getUniqueContractAddress } from 'packages/contracts';
import { useMemo } from 'react';

export interface UseGetUniqueContractAddress<TContractName extends UniqueContractName> {
  name: TContractName;
}

function useGetUniqueContractAddress<TContractName extends UniqueContractName>({
  name,
}: UseGetUniqueContractAddress<TContractName>) {
  // TODO: get from auth context. Right now the config defines the chain ID and so the dApp only
  // needs to support one chain, but since our goal is to become multichain then the chain ID needs
  // to be considered dynamic.
  const { chainId } = config;

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
