import config from 'config';
import {
  GenericContractName,
  UniqueContractName,
  getGenericContract,
  getSwapRouterContract,
  getSwapRouterContractAddress,
  getUniqueContract,
  getUniqueContractAddress,
} from 'packages/contracts';
import { useMemo } from 'react';
import { Token, VToken } from 'types';

import { useAuth } from 'context/AuthContext';

import {
  getComptrollerContract,
  getGovernorBravoDelegateContract,
  getPoolLensContract,
  getSwapRouterContract as getSwapRouterContractOld,
  getTokenContract,
  getVTokenContract,
  getVaiVaultContract,
  getVrtConverterProxyContract,
  getXvsVaultProxyContract,
} from './getters';

export const useTokenContract = (token: Token) => {
  const { signer } = useAuth();
  return useMemo(() => getTokenContract(token, signer || undefined), [signer, token]);
};

export const useVTokenContract = (vToken: VToken) => {
  const { signer } = useAuth();
  return useMemo(() => getVTokenContract(vToken, signer || undefined), [signer, vToken]);
};

export interface UseGetUniqueContractInput<TContractName extends UniqueContractName> {
  name: TContractName;
}

export function useGetUniqueContract<TContractName extends UniqueContractName>({
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

export function useGetUniqueContractAddress<TContractName extends UniqueContractName>({
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

export interface UseGetGenericContractInput<TContractName extends GenericContractName> {
  name: TContractName;
  address: string;
}

export function useGetGenericContract<TContractName extends GenericContractName>({
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

export interface UseGetSwapRouterContractInput {
  comptrollerAddress: string;
}

export function useGetSwapRouterContract({ comptrollerAddress }: UseGetSwapRouterContractInput) {
  const { signer, provider } = useAuth();
  const signerOrProvider = signer || provider;
  // TODO: get from auth context. Right now the config defines the chain ID and so the dApp only
  // needs to support one chain, but since our goal is to become multichain then the chain ID needs
  // to be considered dynamic.
  const { chainId } = config;

  return useMemo(
    () =>
      chainId !== undefined
        ? getSwapRouterContract({
            comptrollerAddress,
            chainId,
            signerOrProvider,
          })
        : undefined,
    [signerOrProvider, comptrollerAddress, chainId],
  );
}

export interface UseGetSwapRouterContractAddressInput {
  comptrollerAddress: string;
}

export function useGetSwapRouterContractAddress({
  comptrollerAddress,
}: UseGetSwapRouterContractAddressInput) {
  // TODO: get from auth context. Right now the config defines the chain ID and so the dApp only
  // needs to support one chain, but since our goal is to become multichain then the chain ID needs
  // to be considered dynamic.
  const { chainId } = config;

  return useMemo(
    () =>
      chainId !== undefined
        ? getSwapRouterContractAddress({
            comptrollerAddress,
            chainId,
          })
        : undefined,
    [chainId],
  );
}

/**
 * @deprecated Use useGetUniqueContract hook instead
 */
export const useVaiVaultContract = () => {
  const { signer } = useAuth();
  return useMemo(() => getVaiVaultContract(signer || undefined), [signer]);
};

/**
 * @deprecated Use useGetUniqueContract hook instead
 */
export const useComptrollerContract = (address: string) => {
  const { signer } = useAuth();
  return useMemo(() => getComptrollerContract(address, signer || undefined), [signer]);
};

/**
 * @deprecated Use useGetUniqueContract hook instead
 */
export const useXvsVaultProxyContract = () => {
  const { signer } = useAuth();
  return useMemo(() => getXvsVaultProxyContract(signer || undefined), [signer]);
};

/**
 * @deprecated Use useGetUniqueContract hook instead
 */
export const useGovernorBravoDelegateContract = () => {
  const { signer } = useAuth();
  return useMemo(() => getGovernorBravoDelegateContract(signer || undefined), [signer]);
};

// VRT conversion
/**
 * @deprecated Use useGetUniqueContract hook instead
 */
export const useVrtConverterProxyContract = () => {
  const { signer } = useAuth();
  return useMemo(() => getVrtConverterProxyContract(signer || undefined), [signer]);
};

/**
 * @deprecated Use useGetSwapRouterContract hook instead
 */
export const useSwapRouterContract = (poolComptrollerAddress: string) => {
  const { signer } = useAuth();
  return useMemo(
    () => getSwapRouterContractOld(poolComptrollerAddress, signer || undefined),
    [signer],
  );
};

/**
 * @deprecated Use useGetUniqueContract hook instead
 */
export const useGetPoolLensContract = () => {
  const { signer } = useAuth();
  return useMemo(() => getPoolLensContract(signer || undefined), [signer]);
};
