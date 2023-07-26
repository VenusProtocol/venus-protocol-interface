import config from 'config';
import { UniqueContractName, getUniqueContract } from 'packages/contracts';
import { useMemo } from 'react';
import { Token, VToken } from 'types';

import { useAuth } from 'context/AuthContext';

import {
  getComptrollerContract,
  getGovernorBravoDelegateContract,
  getMulticallContract,
  getPoolLensContract,
  getSwapRouterContract,
  getTokenContract,
  getVTokenContract,
  getVaiControllerContract,
  getVaiVaultContract,
  getVrtConverterProxyContract,
  getXvsVaultContract,
  getXvsVaultProxyContract,
  getXvsVestingProxyContract,
} from './getters';

export const useTokenContract = (token: Token) => {
  const { signer } = useAuth();
  return useMemo(() => getTokenContract(token, signer || undefined), [signer, token]);
};

export const useVTokenContract = (vToken: VToken) => {
  const { signer } = useAuth();
  return useMemo(() => getVTokenContract(vToken, signer || undefined), [signer, vToken]);
};

type UseGetContractInput<TContractName extends UniqueContractName> = {
  name: TContractName;
};

export function useGetUniqueContract<TContractName extends UniqueContractName>({
  name,
}: UseGetContractInput<TContractName>) {
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
            signerOrProvider,
            chainId,
          })
        : undefined,
    [signerOrProvider, chainId, name],
  );
}

export const useVaiControllerContract = () => {
  const { signer } = useAuth();
  return useMemo(() => getVaiControllerContract(signer || undefined), [signer]);
};

export const useVaiVaultContract = () => {
  const { signer } = useAuth();
  return useMemo(() => getVaiVaultContract(signer || undefined), [signer]);
};

export const useComptrollerContract = (address: string) => {
  const { signer } = useAuth();
  return useMemo(() => getComptrollerContract(address, signer || undefined), [signer]);
};

export const useXvsVaultContract = () => {
  const { signer } = useAuth();
  return useMemo(() => getXvsVaultContract(signer || undefined), [signer]);
};

export const useXvsVaultProxyContract = () => {
  const { signer } = useAuth();
  return useMemo(() => getXvsVaultProxyContract(signer || undefined), [signer]);
};

export const useGovernorBravoDelegateContract = () => {
  const { signer } = useAuth();
  return useMemo(() => getGovernorBravoDelegateContract(signer || undefined), [signer]);
};

// VRT conversion
export const useVrtConverterProxyContract = () => {
  const { signer } = useAuth();
  return useMemo(() => getVrtConverterProxyContract(signer || undefined), [signer]);
};

export const useXvsVestingProxyContract = () => {
  const { signer } = useAuth();
  return useMemo(() => getXvsVestingProxyContract(signer || undefined), [signer]);
};

export const useSwapRouterContract = (poolComptrollerAddress: string) => {
  const { signer } = useAuth();
  return useMemo(
    () => getSwapRouterContract(poolComptrollerAddress, signer || undefined),
    [signer],
  );
};

export const useMulticallContract = () => {
  const { signer } = useAuth();
  return useMemo(() => getMulticallContract(signer || undefined), [signer]);
};

export const useGetPoolLensContract = () => {
  const { signer } = useAuth();
  return useMemo(() => getPoolLensContract(signer || undefined), [signer]);
};
